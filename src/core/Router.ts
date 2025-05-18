import { IncomingMessage, ServerResponse } from "http";
import { parseBody } from "./parse/parseBody";

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

  post(path: string, handler: string) {
    this.addRoute("POST", path, handler);
  }

  put(path: string, handler: string) {
    this.addRoute("PUT", path, handler);
  }

  delete(path: string, handler: string) {
    this.addRoute("DELETE", path, handler);
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

        const body = await parseBody(req);
        (req as any).body = body;

        const [controllerName, methodName] = route.controller.split("@");
        const ControllerModule = await import(
          `../controllers/${controllerName}`
        );
        const controller = new ControllerModule.default();

        const result = await controller[methodName](params, req, res);
        if (!res.writableEnded) res.end(result);
        return;
      }
    }

    res.statusCode = 404;
    res.end("Not Found");
  }
}
