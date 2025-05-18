import { IncomingMessage, ServerResponse } from "http";

export async function parseBody(req: IncomingMessage): Promise<any> {
  const result = new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        if (req.headers["content-type"]?.includes("application/json")) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (e) {
        reject(e);
      }
    });
  });
}
