import { Router, Request, Response } from "express";
import verifyToken from "../middlewares/verify-token";
import DesignService from "../services/design-service";

export default class DesignController{
    private authService = new DesignService();

    public Router() {
        const router = Router();

        router.post("/", verifyToken, async (req: Request, res: Response) => {
            try {
              await this.authService.create((req as any).user);
              res.send("User has been deleted");
            } catch (error) {
              res.status(400).send(error);
            }
          });

          router.get("/", verifyToken, async (req: Request, res: Response) => {
            try {
              await this.authService.get((req as any).user);
              res.send("User has been deleted");
            } catch (error) {
              res.status(400).send(error);
            }
          });

          router.delete("/", verifyToken, async (req: Request, res: Response) => {
            try {
              await this.authService.delete((req as any).user);
              res.send("User has been deleted");
            } catch (error) {
              res.status(400).send(error);
            }
          });

        return router;
    }
}