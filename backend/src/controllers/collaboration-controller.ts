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

    router.post("/", verifyToken, async (req: Request, res: Response) => {
      try {
        collaborationService.createInvitation((req as any).user, req.body.userId, req.body.designId);
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.get("/", verifyToken, async (req: Request, res: Response) => {
      try {
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
      try {

        
      } catch (error) {
        console.error(error);
        res.status(400).send(error);
      }
    });

    return router;
  }
}
