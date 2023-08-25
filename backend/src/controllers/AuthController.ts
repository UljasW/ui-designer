import { Request, Response, Router } from "express";
import AuthService from "../services/authService";
import { error } from "console";
import verifyToken from "../middlewares/verifyToken";

export default class AuthController {
  secret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw error("No secret");
    }

    return secret;
  };

  private authService = new AuthService(this.secret());

  public Router() {
    const router = Router();

    router.post("/login", async (req: Request, res: Response) => {
      try {
        const token = await this.authService.login(
          req.body.email as string,
          req.body.password as string
        );
        res.send(token);
      } catch (error) {
        res.status(400).send(error);
      }
    });

    router.post("/register", async (req: Request, res: Response) => {
      try {
        await this.authService.register(
          req.body.email as string,
          req.body.password as string
        );
        res.send("User has been registered");
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
