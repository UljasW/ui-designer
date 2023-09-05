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
const express_1 = require("express");
const auth_service_1 = __importDefault(require("../services/auth-service"));
const console_1 = require("console");
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
class AuthController {
    constructor(prisma) {
        this.secret = () => {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw (0, console_1.error)("No secret");
            }
            return secret;
        };
        this.prisma = prisma;
    }
    Router() {
        const authService = new auth_service_1.default(this.secret(), this.prisma);
        const router = (0, express_1.Router)();
        router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield authService.login(req.body.email, req.body.password);
                res.send(token);
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        router.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("register");
            try {
                yield authService.register(req.body.email, req.body.password);
                res.send("User has been registered");
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        router.delete("/", verify_token_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield authService.delete(req.user);
                res.send("User has been deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        return router;
    }
}
exports.default = AuthController;
