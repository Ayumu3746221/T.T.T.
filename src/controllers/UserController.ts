import User from "../models/User";

export default class UserController {
  async index(): Promise<string> {
    const users = User.findAll();
    return JSON.stringify(users, null, 2);
  }

  async show(): Promise<string> {
    const user = User.findById(1);
    return JSON.stringify(user, null, 2);
  }
}
