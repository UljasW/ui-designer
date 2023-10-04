import { Request, Response, Router } from "express";
import AuthService from "../services/auth-service";
import { error } from "console";
import verifyToken from "../middlewares/verify-token";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"


export default class AuthController {
  secret = () => {
    dotenv.config()

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw error("No secret");
    }

    return secret;
  };

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }


  public Router() {
    const authService = new AuthService(this.secret(), this.prisma);
    const router = Router();

    router.post("/login", async (req: Request, res: Response) => {
      try {
        const token = await authService.login(
          req.body.email as string,
          req.body.password as string
        );
        res.send(token);
      } catch (error) {
        console.log(error)  
        res.status(400).send(error);
      }
    });

    router.post("/register", async (req: Request, res: Response) => {
      console.log("register")
      try {
        await authService.register(
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
        await authService.delete((req as any).user);
        res.send("User has been deleted");
      } catch (error) {
        res.status(400).send(error);
      }
    });

    return router;
  }
}
