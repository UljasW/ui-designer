import { PrismaClient, User, DesignInvitation } from "@prisma/client";
import { checkIfUserIsDesigner, checkIfUserHasAccess } from "./auth/authorize";

export default class CollaborationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createInvitation(user: User, userId: string, designId: string): Promise<string> {
    await this.authorizeAsDesigner(user, designId);
    return await this.createDesignInvitation(userId, designId);
  }

  public async acceptInvitation(user: User, invitationId: string): Promise<string> {
    const invitation = await this.updateInvitationStatus(invitationId, user.id, false);
    await this.createCollaborator(user.id, invitation.designId);
    return "Invitation has been accepted";
  }

  public async deleteInvitation(user: User, designId: string, invitationId: string): Promise<string> {
    await this.authorizeForAccess(user, designId);
    await this.deleteDesignInvitation(invitationId);
    return "Invitation has been deleted";
  }

  public async kickCollaborator(user: User, designId: string, collaborationId: string): Promise<string> {
    await this.authorizeAsDesigner(user, designId);
    await this.updateCollaboratorStatus(collaborationId, false);
    return "Collaborator has been kicked";
  }

  public async getInvitations(user: User): Promise<DesignInvitation[]> {
    return await this.findUserInvitations(user.id);
  }

  public async getCollaborators(user: User, designId: string): Promise<User[]> {
    await this.authorizeForAccess(user, designId);
    return await this.findDesignCollaborators(designId);
  }

  private async authorizeAsDesigner(user: User, designId: string) {
    await checkIfUserIsDesigner(user, designId, this.prisma);
  }

  private async authorizeForAccess(user: User, designId: string) {
    await checkIfUserHasAccess(user, designId, this.prisma);
  }

  private async createDesignInvitation(userId: string, designId: string): Promise<string> {
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

  private async updateInvitationStatus(invitationId: string, userId: string, isActive: boolean) {
    const invitation = await this.prisma.designInvitation.update({
      where: {
        id: invitationId,
        userId: userId,
      },
      data: {
        isActive: isActive,
      },
    });
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    return invitation;
  }

  private async createCollaborator(userId: string, designId: string) {
    await this.prisma.collaborator.create({
      data: {
        userId: userId,
        designId: designId,
      },
    });
  }

  private async deleteDesignInvitation(invitationId: string) {
    await this.prisma.designInvitation.delete({
      where: {
        id: invitationId,
      },
    });
  }

  private async updateCollaboratorStatus(collaborationId: string, isActive: boolean) {
    const collaborator = await this.prisma.collaborator.update({
      where: {
        id: collaborationId,
      },
      data: {
        isActive: isActive,
      },
    });
    if (!collaborator) {
      throw new Error("Collaborator not found");
    }
  }

  private async findUserInvitations(userId: string): Promise<DesignInvitation[]> {
    const invitations = await this.prisma.designInvitation.findMany({
      where: {
        userId: userId,
      },
    });
    if (!invitations) {
      throw new Error("No invitations found");
    }
    return invitations;
  }

  private async findDesignCollaborators(designId: string): Promise<User[]> {
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
