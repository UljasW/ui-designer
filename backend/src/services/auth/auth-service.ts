import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserInterface from "../../interfaces/user-interface";
import { PrismaClient, User } from "@prisma/client";

export default class AuthService {
  private jwtSecret: string;
  private prisma: PrismaClient;

  constructor(jwtSecret: string, prisma: PrismaClient) {
    this.jwtSecret = jwtSecret;
    this.prisma = prisma;
  }

  public async register(email: string, password: string) {
    this.validateEmail(email);
    await this.checkIfUserExists(email);
    const hashedPassword = await this.hashPassword(password);
    await this.createUser(email, hashedPassword);
  }

  public async login(email: string, password: string): Promise<string> {
    this.validateEmail(email);
    const user = await this.getUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return this.generateToken(user.id);
  }

  public async delete(user: User) {
    await this.deleteUser(user.id);
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    }) as UserInterface;
    return user;
  }

  private async createUser(email: string, password: string) {
    await this.prisma.user.create({
      data: { email, password },
    });
  }

  private async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private async checkIfUserExists(email: string) {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: "24h",
    });
  }

  private validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
  }
}
