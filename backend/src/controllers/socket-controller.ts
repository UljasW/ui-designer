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
    //this.io.use(socketAuthMiddleware);

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

      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  private handleUpdateDb(
    socket: Socket,
    data: any,
    callback: CallableFunction
  ): void {
    console.log("update-db received from client: ", socket.rooms);
    try {
      const objects = Array.isArray(data.objects)
        ? data.objects
        : [data.objects];

      console.log("Objects to update:", objects);

      //await this.designService.updateObjList(user, designId, objects);  // Ensure this function is working!
      callback({ status: "success" });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private handleMoveUpDb(
    socket: Socket,
    data: any,
    callback: CallableFunction
  ): void {
    console.log("move-up-db received from client: ", socket.rooms);
    try {
      const id = data.id;
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
      console.log("Object to move down:", id);

      callback({ status: "success" });
    } catch (error) {
      console.error(`Error updating design: ${error}`);
      callback({ status: "error" });
    }
  }

  private handleDisconnect(socket: Socket): void {
    console.log("User disconnected with socket id:", socket.id);
  }
}
