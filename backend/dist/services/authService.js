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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
class AuthService {
    constructor(jwtSecret) {
        this.prisma = new client_1.PrismaClient();
        this.getUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            const user = data;
            return user;
        });
        this.createUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.create({
                data: {
                    email,
                    password,
                },
            });
        });
        this.deleteUser = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.prisma.user.delete({
                where: {
                    id,
                },
            });
        });
        this.jwtSecret = jwtSecret;
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkEmailAdress(email);
            // Check if user already exists
            const existingUser = this.getUserByEmail(email);
            if (yield existingUser) {
                throw new Error("User already exists");
            }
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Store user in the database
            const newUser = this.createUser(email, hashedPassword);
            return newUser;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch user from the database
            this.checkEmailAdress(email);
            const user = yield this.getUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            // Compare password with the hashed password in the database
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            // Create a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, this.jwtSecret, {
                expiresIn: "1h", // Token expires in 1 hour
            });
            return token;
        });
    }
    checkEmailAdress(email) {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6}){0,1})$/;
        if (!emailRegex.test(email)) {
            throw new Error("Not correct email");
        }
    }
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.deleteUser(user.id);
            }
            catch (error) {
                throw new Error("Somthing went wrong, please try again");
            }
        });
    }
}
exports.default = AuthService;
