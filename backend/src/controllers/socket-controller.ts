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
      console.log("User connected:", socket.id);
      const designId = socket.handshake.query.designId as string;
      //socket.join(designId);

      socket.join(designId);
      socket.on("update-db", (data) => handleUpdateDb(socket, data));
      socket.on("disconnect", () => handleDisconnect(socket));
    });

    function handleUpdateDb(socket: Socket, data: any): void {
      console.log("update-db received from client with socket id:", socket.id);
      try {
        const objects = Array.isArray(data.objects)
          ? data.objects
          : [data.objects];
        console.log("Objects to update:", objects);

        //await this.designService.updateObjList(user, designId, objects);  // Ensure this function is working!

        //socket.emit("updated-db", { status: "success" });
      } catch (error) {
        console.error(`Error updating design: ${error}`);
        //socket.emit("update-db-error", { status: "failed", message: error });
      }
    }

    function handleDisconnect(socket: Socket): void {
      console.log("User disconnected with socket id:", socket.id);
    }
  }
}
