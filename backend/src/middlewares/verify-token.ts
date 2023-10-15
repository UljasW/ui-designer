import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';
const prisma = new PrismaClient();

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractToken(req, res);
    if (!token) return;

    validateToken(token, req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

const extractToken = (req: Request, res: Response): string | null => {
  const authorization = req.headers.authorization as string;
  if (!authorization) {
    res.status(401).send("No authorization header present.");
    return null;
  }

  const token = authorization.split("Bearer ")[1];
  if (!token) {
    res.status(401).send("Malformed authorization header.");
    return null;
  }

  return token;
};

const validateToken = async (token: string, req: Request, res: Response, next: NextFunction) => {
  jwt.verify(token, JWT_SECRET, async (err: any, decodedToken: any) => {
    if (err) {
      return res.status(401).send("Invalid token.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!user) {
      return res.status(404).send("User associated with the token not found.");
    }

    (req as any).user = user;
    next();
  });
};

export default verifyToken;
