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
    objects: any
): Promise<string> {

    this.checkDesign(user, id);

    const objList = await this.prisma.objects.findMany({
      where: {
        designId: id,
      },
    });

    // Loop through objects and update or create them
    for (const obj of objects) {
      const objInDb = objList.find((o) => o.id === obj.id);
      if (objInDb) {
        await this.prisma.objects.update({
          where: {
            id: obj.id,
          },
          data: {
            ...obj,
          },
        });
      } else {
        await this.prisma.objects.create({
          data: {
            id: obj.id,
            layerIndex: obj.layerIndex as number,  // Assuming `obj` has the `layerIndex` property
            data: JSON.stringify(obj),
            designId: id,
          },
        });
        
      }
    }

    // (Optional) If you want to handle deletions, you'd also loop through objList 
    // and check if any object there doesn't exist in the `objects` array and then remove it.

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
