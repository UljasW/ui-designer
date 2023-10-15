import { Router, Request, Response } from "express";
import verifyToken from "../middlewares/verify-token";
import CollaborationService from "../services/collaboration-service";
import { PrismaClient } from "@prisma/client";

export default class CollaborationController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public Router() {
    const collaborationService = new CollaborationService(this.prisma);
    const router = Router();

    router.post("/invite", verifyToken, async (req: Request, res: Response) => {
      try {
        res.send(await collaborationService.createInvitation((req as any).user, req.body.userId, req.body.designId));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.post("/accept-invitation", verifyToken, async (req: Request, res: Response) => {
      try {
        res.send(await collaborationService.acceptInvitation((req as any).user, req.body.invitationId));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.delete("/delete-invitation/:invitationId", verifyToken, async (req: Request, res: Response) => {
      try {
        const invitationId = req.params.invitationId;
        res.send(await collaborationService.deleteInvitation((req as any).user, req.body.designId, invitationId));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.delete("/kick/:collaborationId", verifyToken, async (req: Request, res: Response) => {
      try {
        const collaborationId = req.params.collaborationId;
        res.send(await collaborationService.kickCollaborator((req as any).user, req.body.designId, collaborationId));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.get("/invitations", verifyToken, async (req: Request, res: Response) => {
      try {
        res.send(await collaborationService.getInvitations((req as any).user));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.get("/collaborators/:designId", verifyToken, async (req: Request, res: Response) => {
      try {
        const designId = req.params.designId;
        res.send(await collaborationService.getCollaborators((req as any).user, designId));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    return router;
  }
}
