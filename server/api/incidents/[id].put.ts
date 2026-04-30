export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  try {
    const { id } = getRouterParams(event);
    const body = await readBody(event);

    const incident = await prisma.incident.update({
      where: {
        id: id as string,
      },
      data: body,
    });

    return incident;
  } catch (error) {
    console.error("Error updating incident:", error);
    throw error;
  }
});
