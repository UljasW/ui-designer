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
    await this.deleteDesignById(id);
    return "Design has been removed";
  }

  public async getAll(user: User): Promise<string> {
    return await this.findAllDesigns();
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

  private async deleteRelatedObjects(id: string) {
    await this.prisma.objects.deleteMany({
      where: {
        designId: id,
      },
    });
  }

  private async deleteDesignById(id: string) {
    await this.prisma.design.delete({
      where: {
        id,
      },
    });
  }

  private async findAllDesigns(): Promise<string> {
    const designs = await this.prisma.design.findMany();
    return JSON.stringify(designs);
  }
}
