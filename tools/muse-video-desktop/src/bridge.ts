import { createServer, request as httpRequest, Server } from "node:http";
import { readFileSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import YAML from "yaml";

export const BRIDGE_PORT = 18710;
export const MUSE_PORT = 18610;
export const CLI_PORT = 8317;

export function readClientKeys(configFile: string): string[] {
  if (!configFile) return [];
  const data = YAML.parse(readFileSync(configFile, "utf8")) as {
    access?: { "api-keys"?: unknown };
    "api-keys"?: unknown;
  } | null;
  const keys = data?.access?.["api-keys"] ?? data?.["api-keys"];
  return Array.isArray(keys)
    ? keys.filter((key): key is string => typeof key === "string" && key.length > 0)
    : [];
}

export function authorize(header: string | undefined, keys: readonly string[]): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const actual = Buffer.from(header.slice(7), "utf8");
  return keys.some((key) => {
    const expected = Buffer.from(key, "utf8");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  });
}

function videoPath(pathname: string): boolean {
  return pathname === "/v1/videos" ||
    pathname.startsWith("/v1/videos/") ||
    pathname.startsWith("/v1/media/");
}

export function createGateway(configFile: () => string, museKey: string): Server {
  return createServer((req, res) => {
    const target = req.url ?? "";
    let parsed: URL;
    try {
      if (!target.startsWith("/")) throw new Error("not an origin-form URL");
      parsed = new URL(target, "http://localhost");
    } catch {
      res.writeHead(400).end("Invalid URL");
      return;
    }
    if (parsed.pathname === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ status: "up" }));
      return;
    }
    if (!parsed.pathname.startsWith("/v1/")) {
      res.writeHead(404).end("Not found");
      return;
    }
    let keys: string[];
    try {
      keys = readClientKeys(configFile());
    } catch {
      res.writeHead(503).end("CLIProxy configuration unavailable");
      return;
    }
    if (!authorize(req.headers.authorization, keys)) {
      res.writeHead(401, { "content-type": "application/json" })
        .end(JSON.stringify({ error: { message: "Invalid CLIProxy API key", type: "authentication_error" } }));
      return;
    }
    const isVideo = videoPath(parsed.pathname);
    const port = isVideo ? MUSE_PORT : CLI_PORT;
    const headers = { ...req.headers, host: `127.0.0.1:${port}` };
    // Muse2API uses an internal key; external callers only ever send a CLIProxy key.
    if (isVideo) headers.authorization = `Bearer ${museKey}`;
    delete headers.connection;
    delete headers["proxy-authorization"];

    const upstream = httpRequest({
      hostname: "127.0.0.1", port, method: req.method, path: parsed.pathname + parsed.search,
      headers, timeout: 610000
    }, (reply) => {
      const responseHeaders = { ...reply.headers };
      delete responseHeaders.connection;
      res.writeHead(reply.statusCode ?? 502, responseHeaders);
      reply.pipe(res);
    });
    upstream.on("timeout", () => upstream.destroy(new Error("Upstream timeout")));
    upstream.on("error", () => {
      if (!res.headersSent) res.writeHead(502, { "content-type": "application/json" });
      if (!res.writableEnded) res.end(JSON.stringify({ error: { message: "Upstream unavailable" } }));
    });
    req.on("aborted", () => upstream.destroy());
    req.pipe(upstream);
  });
}
