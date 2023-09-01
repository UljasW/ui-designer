import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserInterface from "../interfaces/user-interface";
import { PrismaClient, User } from "@prisma/client";

export default class AuthService {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  private prisma = new PrismaClient();

  private getUserByEmail = async (email: string): Promise<User> => {
    const data = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const user: UserInterface = data as UserInterface;

    return user;
  };

  private createUser = async (email: string, password: string) => {
    await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  };

  private deleteUser = async (id:string) => {
    const data = await this.prisma.user.delete({
      where: {
        id,
      },
    });
  };

  public async register(email: string, password: string) {
    this.checkEmailAdress(email);
    // Check if user already exists
    const existingUser = this.getUserByEmail(email);
    if (await existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Store user in the database
    const newUser = this.createUser(email, hashedPassword);

    return newUser;
  }

  public async login(email: string, password: string): Promise<string> {
    // Fetch user from the database

    this.checkEmailAdress(email);
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, this.jwtSecret, {
      expiresIn: "24h", // Token expires in 1 hour
    });

    return token;
  }

  checkEmailAdress(email: string) {
    const emailRegex =
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6}){0,1})$/;
    if (!emailRegex.test(email)) {
      throw new Error("Not correct email");
    }
  }

  public async delete(user: User) {
    try {
      this.deleteUser(user.id);
    } catch (error) {
      throw new Error("Somthing went wrong, please try again");
    }
  }
}
