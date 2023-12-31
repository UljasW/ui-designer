import { PrismaClient, User, DesignInvitation } from "@prisma/client";
import { checkIfUserIsDesigner, checkIfUserHasAccess } from "./auth/authorize";

export default class CollaborationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createInvitation(
    user: User,
    email: string,
    designId: string
  ): Promise<string> {
    await this.authorizeAsDesigner(user, designId);
    const userId = (await this.getUserByEmail(email)).id;
    if (await this.checkIfUserHasActiveInvatationById(userId, designId)) {
      throw new Error("User already has active invitation");
    }
    if (await this.isUserAlreadyCollaborator(userId, designId)) {
      throw new Error("User is already a collaborator for this design");
    }
    return await this.createDesignInvitation(userId, designId);
  }

  public async acceptInvitation(
    user: User,
    invitationId: string
  ): Promise<string> {
    const invitation = await this.updateInvitationStatus(
      invitationId,
      user.id,
      false
    );
    await this.createCollaborator(user.id, invitation.designId);
    return "Invitation has been accepted";
  }

  public async deleteInvitation(
    user: User,
    designId: string,
    invitationId: string
  ): Promise<string> {
    await this.authorizeForAccess(user, designId);
    await this.deleteDesignInvitation(invitationId);
    return "Invitation has been deleted";
  }

  public async kickCollaborator(
    user: User,
    designId: string,
    collaborationId: string
  ): Promise<string> {
    await this.authorizeAsDesigner(user, designId);
    await this.updateCollaboratorStatus(collaborationId, false);
    return "Collaborator has been kicked";
  }

  public async getInvitations(user: User): Promise<DesignInvitation[]> {
    return await this.findUserInvitations(user.id);
  }

  public async getInvitationsByDesign(
    user: any,
    designId: string
  ): Promise<DesignInvitation[]> {
    await this.authorizeAsDesigner(user, designId);
    const invitations = await this.findDesignInvitations(designId);
    return invitations;
  }

  public async getCollaborators(user: User, designId: string): Promise<User[]> {
    await this.authorizeAsDesigner(user, designId);
    return await this.findDesignCollaborators(designId);
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  private async authorizeAsDesigner(user: User, designId: string) {
    await checkIfUserIsDesigner(user, designId, this.prisma);
  }

  private async authorizeForAccess(user: User, designId: string) {
    await checkIfUserHasAccess(user, designId, this.prisma);
  }

  private async createDesignInvitation(
    userId: string,
    designId: string
  ): Promise<string> {
    const newInvitation = await this.prisma.designInvitation.create({
      data: {
        designId,
        userId,
      },
    });

    console.log(newInvitation);
    if (!newInvitation) {
      throw new Error("Failed to create invitation");
    }
    return newInvitation.id;
  }

  private async checkIfUserHasActiveInvatationById(
    userId: string,
    designId: string
  ): Promise<boolean> {
    const invitation = await this.prisma.designInvitation.findFirst({
      where: {
        userId: userId,
        designId: designId,
        isActive: true,
      },
    });
    if (invitation) {
      return true;
    }
    return false;
  }

  private async updateInvitationStatus(
    invitationId: string,
    userId: string,
    isActive: boolean
  ) {
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
    const isAlreadyCollaborator = await this.isUserAlreadyCollaborator(
      userId,
      designId
    );

    if (isAlreadyCollaborator) {
      console.log("User is already a collaborator for this design.");
      return;
    }

    await this.prisma.collaborator.create({
      data: {
        userId: userId,
        designId: designId,
      },
    });
  }

  private async isUserAlreadyCollaborator(
    userId: string,
    designId: string
  ): Promise<boolean> {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        userId: userId,
        designId: designId,
      },
    });

    return collaborator ? true : false;
  }

  private async deleteDesignInvitation(invitationId: string) {
    await this.prisma.designInvitation.delete({
      where: {
        id: invitationId,
      },
    });
  }

  private async updateCollaboratorStatus(
    collaborationId: string,
    isActive: boolean
  ) {
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

  private async findUserInvitations(
    userId: string
  ): Promise<DesignInvitation[]> {
    const invitations = await this.prisma.designInvitation.findMany({
      where: {
        userId: userId,
        isActive: true
      },

      include: {
        design: {
          include: {
            designer: true,
          },
        },
        user: true,
      },
    });
    if (!invitations) {
      throw new Error("No invitations found");
    }

    console.log(invitations);
    return invitations;
  }

  private async findDesignInvitations(
    designId: string
  ): Promise<DesignInvitation[]> {
    const invitations = await this.prisma.designInvitation.findMany({
      where: {
        designId: designId,
      },
      include: {
        user: true,
      },
    });
    if (!invitations) {
      throw new Error("No invitations found");
    }

    console.log(invitations);
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
