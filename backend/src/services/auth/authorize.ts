import { PrismaClient, User } from "@prisma/client";

export async function checkIfUserIsDesigner(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await prisma.design.findFirst({
    where: {
      id: id,
    },
  });

  if (!design) {
    throw new Error("No design was found");
  }

  if (design.designerId !== user.id) {
    throw new Error("Not your design");
  }
}

export async function checkIfUserHasAccess(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await prisma.design.findFirst({
    where: {
      id: id,
    },
    include: {
      collaborators: true,
    },
  });

  if (!design) {
    throw new Error("No design was found");
  }

  const collaborator = design.collaborators.find(
    (collaborator) => collaborator.userId === user.id
  );

  if (design.designerId !== user.id || !collaborator) {
    throw new Error("You dont have access to this design");
  }
}
