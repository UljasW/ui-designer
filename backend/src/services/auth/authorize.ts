import { PrismaClient, User } from "@prisma/client";

export async function checkIfUserIsDesigner(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await getDesign(id, prisma);

  autherizeDesigner(user, design.designerId);
}

export async function checkIfUserHasAccess(
  user: User,
  id: string,
  prisma: PrismaClient
) {
  const design = await getDesign(id, prisma);


  const collaborator = design.collaborators.find(
    (collaborator) => collaborator.userId === user.id
  );

  if (design.designerId !== user.id || !collaborator) {
    throw new Error("You dont have access to this design");
  }
}

async function getDesign(id:string, prisma: PrismaClient){
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

  return design;

}

function autherizeDesigner(user: User, id: string) {
  if (user.id !== id) {
    throw new Error("Not your design");
  }
}