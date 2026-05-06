import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, IncidentStatus, CameraNode } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function seedCameras() {
  console.log("Seeding camera nodes...");
  await prisma.cameraNode.deleteMany();

  const camera1 = await prisma.cameraNode.create({
    data: {
      locationTag: "King Fahd Road, Exit 4", // Khobar/Dhahran
      latitude: 26.3023,
      longitude: 50.1511,
      isActive: true,
    },
  });

  const camera2 = await prisma.cameraNode.create({
    data: {
      locationTag: "Prince Turki St", // Khobar
      latitude: 26.2891,
      longitude: 50.2031,
      isActive: true,
    },
  });

  const camera3 = await prisma.cameraNode.create({
    data: {
      locationTag: "Dhahran Highway Km 12", // Dhahran/Dammam
      latitude: 26.3533,
      longitude: 50.1005,
      isActive: true,
    },
  });

  console.log("Created 3 camera nodes.");
  return [camera1, camera2, camera3];
}

async function seedIncidents(cameras: CameraNode[]) {
  console.log("Seeding incidents...");
  await prisma.incident.deleteMany();

  const [camera1, camera2, camera3] = cameras;

  await prisma.incident.createMany({
    data: [
      {
        cameraId: camera1.id,
        severity: 3, // High
        confidence: 98,
        status: IncidentStatus.UNHANDLED, // active -> UNHANDLED
        topic: `incidents/camera/${camera1.id}`,
        imageUrl:
          "https://placehold.co/600x400/png?text=Intersection+Collision",
        detectedAt: new Date("2026-04-13T13:45:00Z"),
        notes: null,
      },
      {
        cameraId: camera2.id,
        severity: 2, // Medium
        confidence: 85,
        status: IncidentStatus.RESOLVED, // handled -> RESOLVED
        agencyId: "1",
        topic: `incidents/camera/${camera2.id}`,
        imageUrl: "https://placehold.co/600x400/png?text=Vehicle+Skid",
        detectedAt: new Date("2026-04-12T15:30:00Z"),
        resolvedAt: new Date("2026-04-12T16:15:00Z"),
        notes: "Ambulance dispatched. Driver treated on site.",
      },
      {
        cameraId: camera3.id,
        severity: 4, // Critical
        confidence: 99,
        status: IncidentStatus.UNHANDLED, // active -> UNHANDLED
        topic: `incidents/camera/${camera3.id}`,
        imageUrl: "https://placehold.co/600x400/png?text=Multi-Vehicle+Pileup",
        detectedAt: new Date("2026-04-13T13:58:00Z"),
        notes: null,
      },
      {
        cameraId: camera2.id,
        severity: 1, // Low
        confidence: 70,
        status: IncidentStatus.RESOLVED, // handled -> RESOLVED
        agencyId: "2",
        topic: `incidents/camera/${camera2.id}`,
        imageUrl: "https://placehold.co/600x400/png?text=Rear-End+Collision",
        detectedAt: new Date("2026-04-12T09:10:00Z"),
        resolvedAt: new Date("2026-04-12T09:45:00Z"),
        notes: "Cleared road safely. Reports filed.",
      },
      {
        cameraId: camera1.id,
        severity: 3, // High
        confidence: 94,
        status: IncidentStatus.RESOLVED, // handled -> RESOLVED
        agencyId: "1",
        topic: `incidents/camera/${camera1.id}`,
        imageUrl: "https://placehold.co/600x400/png?text=T-Bone+Crash",
        detectedAt: new Date("2026-04-11T20:20:00Z"),
        resolvedAt: new Date("2026-04-11T21:00:00Z"),
        notes: "One individual transported to ER.",
      },
    ],
  });

  console.log("Created 5 incidents.");
}

async function seedAgencies() {
  console.log("Seeding agencies...");
  await prisma.emergencyAgency.deleteMany();

  const agenciesData = [
    {
      id: "1",
      name: "King Fahd Hospital Emergency",
      vacancies: 5,
    },
    {
      id: "2",
      name: "Almana General Hospital",
      vacancies: 12,
    },
    {
      id: "3",
      name: "Mouwasat Hospital Dammam",
      vacancies: 3,
    },
    {
      id: "4",
      name: "Red Crescent Dammam",
      vacancies: 8,
    },
  ];

  await prisma.emergencyAgency.createMany({
    data: agenciesData,
  });

  console.log(`Created ${agenciesData.length} agencies.`);
}

async function main() {
  console.log("Starting seed process...");

  // Note: Clear incidents first to avoid foreign key constraint errors
  await prisma.incident.deleteMany();
  await prisma.cameraNode.deleteMany();
  await prisma.emergencyAgency.deleteMany();

  const cameras = await seedCameras();
  await seedAgencies();
  await seedIncidents(cameras);

  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
