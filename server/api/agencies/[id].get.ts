import { IncidentStatus } from "../../../prisma/generated/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const id = event.context.params?.id;

  if (!id) {
    return {
      error: "Agency ID is required",
    };
  }

  const agency = await prisma.emergencyAgency.findUnique({
    where: {
      id,
    },
    include: {
      incidents: {
        include: {
          camera: true,
        },
      },
      _count: {
        select: {
          incidents: {
            where: {
              status: IncidentStatus.RESOLVED,
            },
          },
        },
      },
    },
  });

  return agency;
});
