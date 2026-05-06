export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const agencies = await prisma.emergencyAgency.findMany({
    include: {
      _count: {
        select: { incidents: true }
      }
    }
  });

  return agencies.map(agency => ({
    id: agency.id,
    name: agency.name,
    vacancies: agency.vacancies,
    handledSituationsCount: agency._count.incidents
  }));
});
