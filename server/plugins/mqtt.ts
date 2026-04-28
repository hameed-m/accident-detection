import mqtt from "mqtt";

export default defineNitroPlugin((nitroApp) => {
  const prisma = usePrisma();
  // Connect to your Coolify broker (use your IP or domain)
  const client = mqtt.connect("mqtt://72.62.50.78:8883");

  client.on("connect", () => {
    console.log("✅ Nuxt Background Worker: Connected to MQTT Broker");
    // Subscribe to all Eastern Province alerts using the wildcard
    client.subscribe("sa/ep/#");
  });

  client.on("message", async (topic, payload) => {
    try {
      // Parse the JSON sent by your Jetson Python script
      const data = JSON.parse(payload.toString());

      console.log(`🚨 New alert on ${topic}`);

      // Save directly to the PostgreSQL database
      await prisma.incident.create({
        data: {
          cameraId: data.device_id,
          severity: data.severity,
          imageUrl: data.image_url,
          topic: topic,
          status: "UNHANDLED",
        },
      });
      console.log("💾 Incident successfully saved to database.");
    } catch (error) {
      console.error("❌ Error processing MQTT message:", error);
    }
  });
});
