import * as http from "http";
import { Router } from "./Router";

export class App {
  private router = new Router();

  constructor() {
    this.router.get("/", "HomeController@index");
    this.router.get("/users", "UserController@index");
    this.router.get("/users/:id", "UserController@show");

    this.router.post("/users", "UserController@create");
    this.router.put("/users", "UserController@update");
    this.router.delete("/users", "UserController@destroy");
  }

  listen(port: number) {
    const server = http.createServer((req, res) => {
      this.router.handle(req, res);
    });

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
