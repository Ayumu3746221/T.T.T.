import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";

type HandlerInfo = {
  pattern: RegExp;
  paramNames: string[];
  controller: string;
};

export class Router {
  private routes: { [method: string]: HandlerInfo[] } = {};

  get(path: string, handler: string) {
    this.addRoute("GET", path, handler);
  }

  private addRoute(method: string, path: string, handler: string) {
    const paramNames: string[] = [];
    const regexPath = path.replace(/:([^\/]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    });

    const pattern = new RegExp(`^${regexPath}$`);
    const controller = handler;

    if (!this.routes[method]) this.routes[method] = [];
    this.routes[method].push({ pattern, paramNames, controller });
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || "GET";
    const url = req.url || "/";

    const routeList = this.routes[method] || [];

    for (const route of routeList) {
      const match = url.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        const [controllerName, methodName] = route.controller.split("@");
        const ControllerModule = await import(
          `../controllers/${controllerName}`
        );
        const controller = new ControllerModule.default();

        const result = await controller[methodName](params);
        res.end(result);
        return;
      }
    }

    res.statusCode = 404;
    res.end("Not Found");
  }
}
