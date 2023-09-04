import { Server, Socket } from "socket.io";
import DesignService from "../services/design-service"; // Adjust the path to your DesignService
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
      console.log("User connected:", socket.id);

      socket.on("update-design", async (data: any) => {
        try {
          const user = (socket as any).user;
          const designId = data.designId;
          const objects = data.objects;

          await this.designService.updateObjList(user, designId, objects);
          socket.emit("design-updated", { status: "success" });
        } catch (error) {
          console.error(`Error updating design: ${error}`);
          socket.emit("design-update-error", { status: "failed", message: error });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
}
