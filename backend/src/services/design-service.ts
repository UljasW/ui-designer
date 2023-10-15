import { PrismaClient, User } from "@prisma/client";
import { checkIfUserIsDesigner } from "./auth/authorize";
export default class DesignService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  public async create(user: User, name: string): Promise<string> {
    const design = await this.prisma.design.create({
      data: {
        name: name,
        designerId: user.id,
      },
    });

    return design.id;
  }
  public async delete(user: User, id: string): Promise<string> {
    await checkIfUserIsDesigner(user, id, this.prisma);

    // Deleting related objects first
    await this.prisma.objects.deleteMany({
      where: {
        designId: id,
      },
    });

    // Deleting the design
    await this.prisma.design.delete({
      where: {
        id,
      },
    });

    return "Design has been removed";
  }

  public async getAll(user: User): Promise<string> {
    const designs = await this.prisma.design.findMany();
    return JSON.stringify(designs);
  }

  

}
