import express, { Request, Response } from "express";
import AuthController from "./src/controllers/authController";
import SocketController from "./src/controllers/socketController";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/auth", new AuthController().Router);

new SocketController(io);

server.listen(PORT, () => {
  console.log("Server active");
});
