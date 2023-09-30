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
    
    /*  this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);
      const designId = socket.handshake.query.designId as string;
      console.log(designId);
      //socket.join(designId);

      socket.on("update-db", async (data: any, callback: Function) => {
        console.log("update-db received from client");
      
        try {
          const objects = Array.isArray(data.objects) ? data.objects : [data.objects];
          console.log("Objects to update:", objects);
      
          //await this.designService.updateObjList(user, designId, objects);  // Ensure this function is working!
          
          socket.emit("updated-db", { status: "success" });
        } catch (error) {
          console.error(`Error updating design: ${error}`);
          socket.emit("update-db-error", { status: "failed", message: error });
        }

        callback({ status: "received" });

      });
      

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    }); */

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);
      const designId = socket.handshake.query.designId as string;

      socket.join(designId);
      socket.on("update-db", handleUpdateDb);
      socket.on("disconnect", handleDisconnect);
    });

    function handleUpdateDb(data: any): void {
      console.log("update-db received from client");
      // ... remaining logic
    }

    function handleDisconnect(): void {
      console.log("User disconnected");
    }
  }
}
