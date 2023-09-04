import express, { Request, Response } from "express";
import AuthController from "./src/controllers/auth-controller";
import DesignController from "./src/controllers/design-controller"
import SocketController from "./src/controllers/socket-controller";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/auth", new AuthController(prisma).Router());
app.use("/design", new DesignController(prisma).Router());

new SocketController(io);

server.listen(PORT, () => {
  console.log("Server active");
});
