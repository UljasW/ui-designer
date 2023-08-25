import { Server, Socket } from "socket.io";

export default class SocketController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  private setupEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      // Example: Setting up a custom event
      socket.on("message", (message: string) => {
        console.log(`Message from ${socket.id}: ${message}`);

        // You can also emit events back to clients
        this.io.emit("message", `User ${socket.id} says: ${message}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
}
