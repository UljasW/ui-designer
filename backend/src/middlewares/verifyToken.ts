import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const token = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const bearerHeader = req.headers.authorization as string;
    if (bearerHeader || token) {
      jwt.verify(
        bearerHeader,
        token || "",
        async (err: any, decodedToken: any) => {
          if (err) {
            res.status(401).send("Not logged-in");
          } else {
            const user = await prisma.user.findUnique({
              where: {
                id: decodedToken.id,
              },
            });

            (req as any).user = user;

            next();
          }
        }
      );
    }
    else{
        res.status(401).send("Not logged-in")
    }
  } catch (error) {
    res.status(500).send(error)
  }
};

export default verifyToken;
