import { PrismaClient, User } from "@prisma/client";
import { checkIfUserIsDesigner } from "./auth/authorize";

export default class DesignService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: User, name: string): Promise<string> {
    return await this.createDesign(user, name);
  }

  public async delete(user: User, id: string): Promise<string> {
    await this.authorizeUser(user, id);
    await this.deleteRelatedObjects(id);
    await this.deleteDesignInvitation(id);
    await this.deleteCollaborator(id);
    await this.deleteDesignById(id);
    return "Design has been removed";
  }

  public async getAllByUser(user: User): Promise<string> {
    return await this.findDesignsByUser(user);
  }

  private async createDesign(user: User, name: string): Promise<string> {
    const design = await this.prisma.design.create({
      data: {
        name: name,
        designerId: user.id,
      },
    });
    return design.id;
  }

  private async authorizeUser(user: User, id: string) {
    await checkIfUserIsDesigner(user, id, this.prisma);
  }

 

  private async deleteDesignById(id: string) {
    await this.prisma.design.delete({
      where: {
        id,
      },
    });
  }

  private async deleteDesignInvitation(id: string) {
    await this.prisma.designInvitation.deleteMany({
      where: {
        designId: id,
      },
    });
  }

  private async deleteRelatedObjects(id: string) {
    await this.prisma.objects.deleteMany({
      where: {
        designId: id,
      },
    });
  }

  private async deleteCollaborator(id: string) {
    await this.prisma.collaborator.deleteMany({
      where: {
        designId: id,
      },
    });
  }

  private async findDesignsByUser(user: User): Promise<string> {
    const myFoundDesignes =
      (await this.prisma.design.findMany({ where: { designerId: user.id } })) ||
      [];
    const myDesignes = myFoundDesignes.map((design) => ({...design, isOwner: true}));

    const foundSharedDesigns =
      (await this.prisma.collaborator.findMany({
        where: { userId: user.id },
        include: { design: true },
      })) || [];

    const sharedDesigns = foundSharedDesigns.map((collaborator) => ({
      ...collaborator.design,
      isOwner: false,
    }));
    

    const designs = [
      ...myDesignes,
      ...sharedDesigns,
    ].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
    return JSON.stringify(designs);
  }
}
