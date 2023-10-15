import { PrismaClient, User } from "@prisma/client";
import { checkIfUserHasAccess } from "./auth/authorize";

export default class ObjectService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async getObjects(user: any, designId: string) {
    await this.authorizeUser(user, designId);
    return await this.findObjectsByDesignId(designId);
  }

  public async deleteObjects(user: User, id: string, objects: any): Promise<string> {
    await this.authorizeUser(user, id);
    await this.deleteObjectsByIds(objects);
    return "Objects have been removed";
  }

  public async updateObjList(user: User, id: string, objects: any): Promise<string> {
    await this.authorizeUser(user, id);
    const objList = await this.findObjectsByDesignId(id);
    await this.updateOrCreateObjects(objects, objList, id);
    return "updated";
  }

  private async authorizeUser(user: any, designId: string) {
    await checkIfUserHasAccess(user, designId, this.prisma);
  }

  private async findObjectsByDesignId(designId: string) {
    const objects = await this.prisma.objects.findMany({
      where: {
        designId: designId,
      },
    });
    return objects.map((obj) => JSON.parse(obj.data));
  }

  private async deleteObjectsByIds(objects: any) {
    await this.prisma.objects.deleteMany({
      where: {
        id: {
          in: objects.map((obj: any) => obj.id),
        },
      },
    });
  }

  private async updateOrCreateObjects(objects: any, objList: any, designId: string) {
    for (const obj of objects) {
      const objInDb = objList.find((o : any) => o.id === obj.id);
      if (objInDb) {
        await this.updateObject(obj, designId);
      } else {
        await this.createObject(obj, designId);
      }
    }
  }

  private async updateObject(obj: any, designId: string) {
    console.log("Updating object: ", obj.id, "in design: ", designId);
    await this.prisma.objects.update({
      where: {
        id: obj.id,
      },
      data: {
        data: JSON.stringify(obj),
      },
    });
  }

  private async createObject(obj: any, designId: string) {
    console.log("Creating new object: ", obj.id, "in design: ", designId);
    await this.prisma.objects.create({
      data: {
        id: obj.id,
        layerIndex: obj.layerIndex as number,
        data: JSON.stringify(obj),
        designId: designId,
      },
    });
  }
}
