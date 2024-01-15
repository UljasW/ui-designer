import express, { Request, Response } from "express";
import AuthController from "./src/controllers/auth-controller";
import DesignController from "./src/controllers/design-controller";
import SocketController from "./src/controllers/socket-controller";
import CollaborationController from "./src/controllers/collaboration-controller";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    allowedHeaders:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/auth", new AuthController(prisma).Router());
app.use("/design", new DesignController(prisma).Router());
app.use("/collab", new CollaborationController(prisma).Router());


new SocketController(io, prisma);

server.listen(PORT, () => {
  console.log("Server active");
});
