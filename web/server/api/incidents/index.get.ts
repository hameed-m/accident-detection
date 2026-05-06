import { IncidentStatus } from "../../../prisma/generated/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const { status, topic } = getQuery(event);
  return prisma.incident.findMany({
    where: {
      status: status as IncidentStatus,
      topic: topic ? { startsWith: String(topic).slice(0, -1) } : undefined
    },
  });
});
