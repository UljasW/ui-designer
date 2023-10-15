import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';
const prisma = new PrismaClient();

const socketAuthMiddleware = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.query.token as string;
    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    validateSocketToken(token, socket, next);
  } catch (error) {
    console.error(error);
    next(new Error("Authentication error: Internal server error"));
  }
};

const validateSocketToken = async (token: string, socket: Socket, next: (err?: any) => void) => {
  jwt.verify(token, JWT_SECRET, async (err: any, decodedToken: any) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!user) {
      return next(new Error("Authentication error: User associated with the token not found"));
    }

    (socket.request as any).user = user;
    next();
  });
};

export default socketAuthMiddleware;
