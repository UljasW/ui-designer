import { Server, Socket } from "socket.io";
import DesignService from "../services/design-service";
import socketAuthMiddleware from "../middlewares/socket-auth-middleware";
import { PrismaClient } from "@prisma/client";

export default class SocketController {
  private io: Server;
  private designService: DesignService;

  constructor(io: Server, prisma: PrismaClient) {
    this.io = io;
    this.designService = new DesignService(prisma);
    this.setupEvents();
  }

  private setupEvents(): void {
    this.io.use(socketAuthMiddleware);

    this.io.on("connection", (socket: Socket) => {
      const designId = socket.handshake.query.designId as string;
      console.log("Joining room with designId:", designId);
      socket.join(designId);

      socket.on("update-db", (data, callback) =>
        this.handleUpdateDb(socket, data, callback)
      );
      socket.on("move-up-db", (data, callback) =>
        this.handleMoveUpDb(socket, data, callback)
      );
      socket.on("move-down-db", (data, callback) =>
        this.handleMoveDownDb(socket, data, callback)
      );

      socket.on("get-objects", ( callback) => {
        this.handleGetObjects(socket, callback);
      });

      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  private async handleUpdateDb(
    socket: Socket,
    data: any,
    callback: CallableFunction
  ): Promise<void> {
    console.log("update-db received from client: ", socket.rooms);
    try {
      console.log("Received data:", data);

      const objects = Array.isArray(data.objects)
        ? data.objects
        : [data.objects];

      const user = (socket.request as any).user;
      const designId = socket.handshake.query.designId as string;

      await this.designService.updateObjList(user, designId, objects);
      callback({ status: "success" });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private async handleMoveUpDb(
    socket: Socket,
    data: any,
    callback: CallableFunction
  ): Promise<void> {
    console.log("move-up-db received from client: ", socket.rooms);
    try {
      const id = data.id;
      const user = (socket.request as any).user;
      const designId = socket.handshake.query.designId as string;

      await this.designService.moveUp(user, designId, id);

      console.log("Object to move up:", id);

      callback({ status: "success" });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private handleMoveDownDb(
    socket: Socket,
    data: any,
    callback: CallableFunction
  ): void {
    console.log("move-down-db received from client : ", socket.rooms);
    try {
      const id = data.id;
      const user = (socket.request as any).user;
      const designId = socket.handshake.query.designId as string;

      this.designService.moveDown(user, designId, id);

      console.log("Object to move down:", id);

      callback({ status: "success" });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private async handleGetObjects(
    socket: Socket,
    callback: CallableFunction
  ): Promise<void> {
    console.log("get-objects received from client : ", socket.rooms);
    try {
      const user = (socket.request as any).user;
      const designId = socket.handshake.query.designId as string;

      const objects = await this.designService.getObjects(user, designId);
      callback({ objects });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private handleDisconnect(socket: Socket): void {
    console.log("User disconnected with socket id:", socket.id);
  }
}
