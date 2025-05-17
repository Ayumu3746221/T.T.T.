export type UserType = {
  id: number;
  name: string;
  email: string;
};

export default class User {
  private static users: UserType[] = [
    { id: 1, name: "Taro", email: "taro@example.com" },
    { id: 2, name: "Hanako", email: "hanako@example.com" },
  ];

  static findAll(): UserType[] {
    return this.users;
  }

  static findById(id: number): UserType | undefined {
    return this.users.find((user) => user.id === id);
  }
}
