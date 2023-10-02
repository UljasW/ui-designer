import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

const prisma = new PrismaClient();

const socketAuthMiddleware = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.query.token as string;

    if (!token) {
      console.log("Authentication error: Token not provided")
      return next(new Error("Authentication error: Token not provided"));
    }

    jwt.verify(token, JWT_SECRET, async (err: any, decodedToken: any) => {
      if (err) {
        console.log("Authentication error: Invalid token ", err)
        return next(new Error("Authentication error: Invalid token"));
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.userId,
        },
      });

      if (!user) {
        console.log("Authentication error: User associated with the token not found")
        return next(new Error("Authentication error: User associated with the token not found"));
      }

      // Attach the user object to the socket for use in subsequent events
      (socket.request as any).user = user;
      next();
    });
  } catch (error) {
    console.error(error);  // log the error for debugging
    next(new Error("Authentication error: Internal server error"));
  }
};

export default socketAuthMiddleware;
