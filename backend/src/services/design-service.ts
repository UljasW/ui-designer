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
    await this.authorize(user, id);

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

  public async updateObjList(
    user: User,
    id: string,
    objects: any
  ): Promise<string> {
    await this.authorize(user, id);

    const objList = await this.prisma.objects.findMany({
      where: {
        designId: id,
      },
    });

    // Loop through objects and update or create them
    for (const obj of objects) {
      const objInDb = objList.find((o) => o.id === obj.id);
      if (objInDb) {
        console.log("Updating object: ", obj.id, "in design: ", id);
        await this.prisma.objects.update({
          where: {
            id: obj.id,
          },
          data: {
            data: JSON.stringify(obj),
          },
        });
      } else {
        console.log("Creating new object: ", obj.id, "in design: ", id);

        await this.prisma.objects.create({
          data: {
            id: obj.id,
            layerIndex: obj.layerIndex as number,
            data: JSON.stringify(obj),
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

  public async getObjects(user: any, designId: string) {
    await this.authorize(user, designId);

    const objects = await this.prisma.objects.findMany({
      where: {
        designId: designId,
      },
    });

    return objects.map((obj) => JSON.parse(obj.data));
  }

  private async authorize(user: User, id: string) {
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
