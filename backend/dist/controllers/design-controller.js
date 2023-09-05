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
const verify_token_1 = __importDefault(require("../middlewares/verify-token"));
const design_service_1 = __importDefault(require("../services/design-service"));
class DesignController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    Router() {
        const authService = new design_service_1.default(this.prisma);
        const router = (0, express_1.Router)();
        router.post("/", verify_token_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.send(yield authService.create(req.user, req.body.name));
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        router.get("/", verify_token_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.send(yield authService.getAll(req.user));
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        router.delete("/", verify_token_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield authService.delete(req.user, req.body.id);
                res.send("User has been deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        }));
        return router;
    }
}
exports.default = DesignController;
