import { usePrisma } from "../../utils/prisma";
import { IncidentStatus } from "../../../prisma/generated/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const { status } = getQuery(event);
  return prisma.incident.findMany({
    where: {
      status: status as IncidentStatus,
    },
  });
});
