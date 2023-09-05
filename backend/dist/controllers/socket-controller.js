"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const design_service_1 = __importDefault(require("../services/design-service"));
const socket_auth_middleware_1 = __importDefault(require("../middlewares/socket-auth-middleware"));
class SocketController {
    constructor(io, prisma) {
        this.io = io;
        this.designService = new design_service_1.default(prisma);
        this.setupEvents();
    }
    setupEvents() {
        this.io.use(socket_auth_middleware_1.default);
        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);
            const designId = socket.handshake.query.designId;
            socket.on("update-design", (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = socket.user;
                    const objects = data.objects;
                    yield this.designService.updateObjList(user, designId, objects);
                    socket.emit("design-updated", { status: "success" });
                }
                catch (error) {
                    console.error(`Error updating design: ${error}`);
                    socket.emit("design-update-error", { status: "failed", message: error });
                }
            }));
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
}
exports.default = SocketController;
