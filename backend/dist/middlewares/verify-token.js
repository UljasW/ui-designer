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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
}
const prisma = new client_1.PrismaClient();
const verifyToken = (req, res, next) => {
    try {
        const authorization = req.headers.authorizatsion;
        if (!authorization) {
            res.status(401).send("No authorization header present.");
        }
        const token = authorization.split("Bearer ")[1];
        if (!token) {
            res.status(401).send("Malformed authorization header.");
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).send("Invalid token.");
            }
            const user = yield prisma.user.findUnique({
                where: {
                    id: decodedToken.id,
                },
            });
            if (!user) {
                return res.status(404).send("User associated with the token not found.");
            }
            req.user = user;
            next();
        }));
    }
    catch (error) {
        console.error(error); // log the error for debugging
        res.status(500).send("Internal server error.");
    }
};
exports.default = verifyToken;
