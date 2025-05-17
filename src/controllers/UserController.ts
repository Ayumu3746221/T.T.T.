import User from "../models/User";
import { IncomingMessage } from "http";

export default class UserController {
  async index(): Promise<string> {
    const users = User.findAll();
    return JSON.stringify(users, null, 2);
  }

  async show(params: { id: string }): Promise<string> {
    const user = User.findById(Number(params.id));
    return JSON.stringify(user, null, 2);
  }

  async create(params: any, req: IncomingMessage): Promise<string> {
    return "Create user endpoint hit (POST)";
  }

  async update(params: any, req: IncomingMessage): Promise<string> {
    return `Update user with id ${params.id} (PUT)`;
  }

  async destroy(params: any, req: IncomingMessage): Promise<string> {
    return `Delete user with id ${params.id} (DELETE)`;
  }
}
