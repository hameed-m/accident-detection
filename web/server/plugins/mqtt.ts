import mqtt from "mqtt";

export default defineNitroPlugin((nitroApp) => {
  const prisma = usePrisma();
  const client = mqtt.connect("mqtts://broker.hivemq.com:8883");

  client.on("connect", () => {
    console.log("✅ Nuxt Background Worker: Connected to MQTT Broker");
    client.subscribe("nws7D1IJ/sa/ep/#");
  });

  client.on("message", async (topic, payload) => {
    try {
      const data = JSON.parse(payload.toString());

      console.log(`🚨 New alert on ${topic}`);

      // Save directly to the PostgreSQL database
      await prisma.incident.create({
        data: {
          cameraId: data.cameraId,
          severity: data.severity,
          imageUrl: data.image_url,
          confidence: data.confidence,
          topic: topic,
          status: "UNHANDLED",
        },
      });
      console.log("💾 Incident successfully saved to database.");

      // Push to the live MQTT log buffer
      pushMqttLog({
        topic,
        severity: data.severity,
        confidence: data.confidence,
        deviceId: data.device_id,
        status: "saved",
        message: `Incident saved — severity ${data.severity}, confidence ${data.confidence}%`,
      });
    } catch (error) {
      console.error("❌ Error processing MQTT message:", error);

      // Log the error to the live buffer too
      pushMqttLog({
        topic,
        severity: 0,
        confidence: 0,
        deviceId: "unknown",
        status: "error",
        message: `Failed to process: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
});
