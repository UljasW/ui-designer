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
): Promise<string> {/* 

    this.checkDesign(user, id);

    const objList = await this.prisma.objects.findMany({
      where: {
        designId: id,
      },
    });

    for (let index = 0; index < objects.length; index++) {
      const element = objects[index];

      const existingObject = objList.find((obj) => obj.id === element.id);

      if (existingObject) {
        // Check if the LayerIndex has changed or any other field you care about
        if (existingObject.LayerIndex !== index ) {
          await this.prisma.objects.update({
            where: {
              designId: id,
              id: element.id,
            },
            data: {
              data: element.data,
              LayerIndex: index, // Update the LayerIndex too
            },
          });
        }
      } else {
        await this.prisma.objects.create({
          data: {
            id: element.id,
            data: element.data,
            LayerIndex: index,
            designId: id,
          },
        });
      }
    } */

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
