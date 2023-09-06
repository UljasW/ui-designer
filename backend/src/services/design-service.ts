import { PrismaClient, User } from "@prisma/client";
import objectInterface from "../interfaces/object-interface";

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
    this.checkDesign(user, id);
    await this.prisma.design.delete({
      where: {
        id,
      },
    });

    return "Design has been removed";
  }
  public async updateObjList(
    user: User,
    id: string,
    objects: objectInterface[]
  ): Promise<string> {
    this.checkDesign(user, id);

    for (const element of objects) {
      const objectExists = await this.prisma.objects.findUnique({
        where: {
          designId: id,
          id: element.id,
        },
      });
  
      if (objectExists) {
        await this.prisma.objects.update({
          where: {
            designId: id,
            id: element.id,
          },
          data: {
            data: element.data,
          },
        });
      } else {
        await this.prisma.objects.create({
          data: {
            id : element.id,
            data: element.data,
            designId: id,
          },
        });
      }
    }
  
    return "updated";
  }

  public async getAll(user: User): Promise<string> {
    const designs = await this.prisma.design.findMany();
    return JSON.stringify(designs);
  }

  private async checkDesign(user: User, id: string) {
    const design = await this.prisma.design.findFirst({
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
}
