import { PrismaClient, User } from "@prisma/client";

/**
 * Checks if the user is the designer of the design with the given ID.
 */
export async function checkIfUserIsDesigner(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await getDesign(id, prisma);
  authorizeDesigner(user, design.designerId);
}

/**
 * Checks if the user has access to the design with the given ID.
 */
export async function checkIfUserHasAccess(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await getDesign(id, prisma);
  const collaborator = design.collaborators.find(
    (collaborator) => collaborator.userId === user.id
  );

  if (design.designerId !== user.id && !collaborator) {
    throw new Error("You do not have access to this design");
  }
}

/**
 * Retrieves a design by its ID.
 */
async function getDesign(id: string, prisma: PrismaClient) {
  const design = await prisma.design.findFirst({
    where: {
      id: id,
    },
    include: {
      collaborators: true,
    },
  });

  if (!design) {
    throw new Error("Design not found");
  }

  return design;
}

/**
 * Authorizes the designer by ID.
 */
function authorizeDesigner(user: User, id: string) {
  if (user.id !== id) {
    throw new Error("Unauthorized: This is not your design");
  }
}
