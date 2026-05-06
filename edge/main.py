import cv2
import numpy as np
import tensorrt as trt
import pycuda.driver as cuda
from collections import deque
from config import ENGINE_PATH, INPUT_SHAPE, DETECTION_THRESHOLD, SMOOTHING_WINDOW
from mqtt_handler import MQTTAlertPublisher


def gstreamer_pipeline(
    capture_width=1280,
    capture_height=720,
    display_width=640,
    display_height=480,
    framerate=15,
    flip_method=0,
):
    return (
        "nvarguscamerasrc ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )


def load_engine():
    cuda.init()
    device = cuda.Device(0)
    cuda_context = device.make_context()

    print(f"Loading TensorRT engine from {ENGINE_PATH}...")
    logger = trt.Logger(trt.Logger.WARNING)
    with open(ENGINE_PATH, "rb") as f, trt.Runtime(logger) as runtime:
        engine = runtime.deserialize_cuda_engine(f.read())

    context = engine.create_execution_context()

    input_names = []
    output_names = []
    for i in range(engine.num_io_tensors):
        name = engine.get_tensor_name(i)
        if engine.get_tensor_mode(name) == trt.TensorIOMode.INPUT:
            input_names.append(name)
        else:
            output_names.append(name)

    input_name = input_names[0]
    output_name = output_names[0]

    output_shape = engine.get_tensor_shape(output_name)
    input_dtype = trt.nptype(engine.get_tensor_dtype(input_name))
    output_dtype = trt.nptype(engine.get_tensor_dtype(output_name))

    context.set_input_shape(input_name, INPUT_SHAPE)
    input_size = int(np.prod(INPUT_SHAPE) * np.dtype(input_dtype).itemsize)
    output_size = int(np.prod(output_shape) * np.dtype(output_dtype).itemsize)

    d_input = cuda.mem_alloc(input_size)
    d_output = cuda.mem_alloc(output_size)

    context.set_tensor_address(input_name, int(d_input))
    context.set_tensor_address(output_name, int(d_output))

    stream = cuda.Stream()
    h_output = np.empty(output_shape, dtype=output_dtype)

    print("TensorRT Engine loaded successfully!")
    return cuda_context, context, d_input, d_output, stream, h_output, input_dtype


def preprocess(frame, dtype):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (128, 128))
    normalized = resized.astype("float") / 255.0
    batched = np.expand_dims(np.expand_dims(normalized, axis=-1), axis=0)
    return np.ascontiguousarray(batched.astype(dtype))


def infer(context, d_input, d_output, stream, h_output, input_data):
    cuda.memcpy_htod_async(d_input, input_data, stream)
    context.execute_async_v3(stream.handle)
    cuda.memcpy_dtoh_async(h_output, d_output, stream)
    stream.synchronize()
    return float(h_output.flat[0])


def main():
    alert_publisher = MQTTAlertPublisher()
    cuda_ctx, context, d_input, d_output, stream, h_output, input_dtype = load_engine()
    prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)

    print("Starting IMX219 CSI Camera...")
    cap = cv2.VideoCapture(gstreamer_pipeline(flip_method=0), cv2.CAP_GSTREAMER)

    if not cap.isOpened():
        print("Error: Could not open the CSI camera.")
        exit()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            input_data = preprocess(frame, input_dtype)
            raw_prediction = infer(context, d_input, d_output, stream, h_output, input_data)
            prediction_buffer.append(raw_prediction)
            prediction = sum(prediction_buffer) / len(prediction_buffer)

            if prediction > DETECTION_THRESHOLD:
                label = f"ACCIDENT DETECTED! ({prediction:.2f})"
                color = (0, 0, 255)
                alert_publisher.publish_alert(prediction)
            else:
                label = f"Normal Traffic ({prediction:.2f})"
                color = (0, 255, 0)

            cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            cv2.imshow("Real-Time Accident Detection", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()
        alert_publisher.disconnect()
        cuda_ctx.pop()


if __name__ == "__main__":
    main()