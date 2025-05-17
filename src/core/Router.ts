import * as http from "http";

type RouteMap = {
  [key: string]: string;
};

export class Router {
  private routes: RouteMap = {};

  get(path: string, handler: string) {
    this.routes[`GET ${path}`] = handler;
  }

  async handle(req: http.IncomingMessage, res: http.ServerResponse) {
    const key = `${req.method} ${req.url}`;
    const handler = this.routes[key];

    if (!handler) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const [controllerName, methodName] = handler.split("@");
    const ControllerClass = await import(`../controllers/${controllerName}`);
    const controller = new ControllerClass.default();
    const result = await controller[methodName]();
    res.end(result);
  }
}
