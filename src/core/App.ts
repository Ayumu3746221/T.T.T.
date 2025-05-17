import * as http from "http";
import { Router } from "./Router";

export class App {
  private router = new Router();

  constructor() {
    this.router.get("/", "HomeController@index");
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
