"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketController {
    constructor(io) {
        this.io = io;
        this.setupEvents();
    }
    setupEvents() {
        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);
            // Example: Setting up a custom event
            socket.on("message", (message) => {
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
exports.default = SocketController;
