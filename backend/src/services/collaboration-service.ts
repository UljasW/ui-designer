import { PrismaClient, User, DesignInvitation } from "@prisma/client";
import { checkIfUserIsDesigner, checkIfUserHasAccess } from "./auth/authorize";

export default class CollaborationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createInvitation(
    user: User,
    userId: string,
    designId: string
  ): Promise<string> {
    await checkIfUserIsDesigner(user, designId, this.prisma);

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

  public async acceptInvitation(
    user: User,
    invitationId: string
  ): Promise<string> {
    const invitation = await this.prisma.designInvitation.update({
      where: {
        id: invitationId,
        userId: user.id,
      },
      data: {
        isActive: false,
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    await this.prisma.collaborator.create({
      data: {
        userId: user.id,
        designId: invitation.designId,
      },
    });

    return "Invitation has been accepted";
  }

  public async deleteInvitation(
    user: User,
    designId: string,
    invitationId: string
  ): Promise<string> {
    const invitation = await this.prisma.designInvitation.findFirst({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    await checkIfUserHasAccess(user, designId, this.prisma);

    await this.prisma.designInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    return "Invitation has been deleted";
  }

  public async kickCollaborator(
    user: User,
    designId: string,
    collaborationId: string
  ): Promise<string> {
    await checkIfUserIsDesigner(user, designId, this.prisma);

    const collaborator = await this.prisma.collaborator.update({
      where: {
        id: collaborationId,
      },
      data: {
        isActive: false,
      },
    });

    if (!collaborator) {
      throw new Error("Collaborator not found");
    }

    return "Collaborator has been kicked";
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

  public async getCollaborators(user: User, designId: string): Promise<User[]> {
    await checkIfUserHasAccess(user, designId, this.prisma);

    const collaborators = await this.prisma.collaborator.findMany({
      where: {
        designId,
      },
      include: {
        user: true,
      },
    });

    if (!collaborators) {
      throw new Error("No collaborators found");
    }

    return collaborators.map((collaborator) => collaborator.user);
  }

  
}
