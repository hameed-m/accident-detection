export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const cameras = await prisma.cameraNode.findMany({
    include: {
      _count: {
        select: { incidents: true }
      }
    },
    orderBy: { id: "asc" }
  });

  return cameras.map((cam) => ({
    id: cam.id,
    locationTag: cam.locationTag,
    latitude: cam.latitude,
    longitude: cam.longitude,
    isActive: cam.isActive,
    topic: cam.topic,
    incidentCount: cam._count.incidents,
    createdAt: cam.createdAt,
    updatedAt: cam.updatedAt
  }));
});
