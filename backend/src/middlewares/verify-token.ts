import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.log(JWT_SECRET)
  throw new Error("JWT_SECRET is missing in environment variables");
}

const prisma = new PrismaClient();


const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authorization = req.headers.authorizatsion as string;

    if (!authorization) {
        res.status(401).send("No authorization header present.");
    }

    const token = authorization.split("Bearer ")[1];
    if (!token) {
       res.status(401).send("Malformed authorization header.");
    }

    jwt.verify(token, JWT_SECRET, async (err : any, decodedToken : any) => {
      if (err) {
        return res.status(401).send("Invalid token.");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.id,
        },
      });

      if (!user) {
        return res.status(404).send("User associated with the token not found.");
      }

      (req as any).user = user;
      next();
    });
  } catch (error) {
    console.error(error);  // log the error for debugging
    res.status(500).send("Internal server error.");
  }
};

export default verifyToken;
