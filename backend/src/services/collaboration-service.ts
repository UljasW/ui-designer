import { PrismaClient, User, DesignInvitation } from "@prisma/client";

export default class CollaborationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createInvitation(user: User, userId: string, designId: string): Promise<string> {
    await this.authorize(user, designId);

    const newInvitation = await this.prisma.designInvitation.create({
      data: {
        designId,
        userId,
      },
    });

    if (!newInvitation) {
      throw new Error("Failed to create invitation");
    }

    return newInvitation.id;
  }

  public async acceptInvitation(user: User, invitationId: string): Promise<string> {
    const invitation = await this.prisma.designInvitation.update({
      where: {
        id: invitationId,
        userId: user.id,
      },
      data: {
        accepted: true,
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    return "Invitation has been accepted";
  }

  public async getInvitations(user: User): Promise<DesignInvitation[]> {
    const invitations = await this.prisma.designInvitation.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!invitations) {
      throw new Error("No invitations found");
    }

    return invitations;
  }

  public async deleteInvitation(user: User, invitationId: string): Promise<string> {
    throw new Error("Not implemented");
  }

  private async authorize(user: User, id: string): Promise<void> {
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
