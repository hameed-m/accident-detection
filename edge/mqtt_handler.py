import paho.mqtt.client as mqtt
import json
import time
import ssl
from datetime import datetime, timezone
from config import (
    MQTT_BROKER,
    MQTT_PORT,
    MQTT_TOPIC,
    MQTT_CLIENT_ID,
    ALERT_COOLDOWN_SECONDS,
)


def classify_severity(confidence):
    if confidence >= 0.85:
        return 3
    elif confidence >= 0.70:
        return 2
    else:
        return 1


class MQTTAlertPublisher:
    def __init__(self):
        self.client = None
        self.last_alert_time = 0
        self._connect()

    def _connect(self):
        self.client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2, client_id=MQTT_CLIENT_ID
        )
        self.client.on_connect = self._on_connect
        self.client.on_publish = self._on_publish
        self.client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)

        print(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT} (TLS)...")
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"⚠️  MQTT connection failed: {e} — continuing without MQTT.")
            self.client = None

    @staticmethod
    def _on_connect(client, userdata, flags, reason_code, properties=None):
        if reason_code == 0:
            print(f"✅ MQTT connected to {MQTT_BROKER} | Topic: {MQTT_TOPIC}")
        else:
            print(f"❌ MQTT connection failed (code {reason_code})")

    @staticmethod
    def _on_publish(client, userdata, mid, reason_code, properties=None):
        print(f"✅ Alert message {mid} acknowledged by broker.")

    def publish_alert(self, prediction):
        if not self.client:
            return

        current_time = time.time()
        if (current_time - self.last_alert_time) < ALERT_COOLDOWN_SECONDS:
            return

        severity = classify_severity(prediction)
        payload = {
            "device_id": MQTT_CLIENT_ID,
            "severity": severity,
            "confidence": round(prediction, 4),
            "image_url": "",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        json_data = json.dumps(payload)
        result = self.client.publish(MQTT_TOPIC, json_data, qos=1)

        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"📤 Alert published to {MQTT_TOPIC}: {json_data}")
        else:
            print(f"⚠️  Publish failed (rc={result.rc})")

        self.last_alert_time = current_time

    def disconnect(self):
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
            print("🔌 MQTT client disconnected.")
