import { Router, Request, Response } from "express";
import verifyToken from "../middlewares/verify-token";
import DesignService from "../services/design-service";
import { PrismaClient } from "@prisma/client";

export default class DesignController {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public Router() {
    const authService = new DesignService(this.prisma);

    const router = Router();

    router.post("/", verifyToken, async (req: Request, res: Response) => {
      try {
        res.send(await authService.create((req as any).user, req.body.name));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.get("/", verifyToken, async (req: Request, res: Response) => {
      try {
        res.send(await authService.getAll((req as any).user));
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.delete("/", verifyToken, async (req: Request, res: Response) => {
      try {
        await authService.delete((req as any).user, req.body.id);
        res.send("User has been deleted");
      } catch (error) {
        res.status(400).send(error);
      }
    });

    return router;
  }
}