import { createServer, request as httpRequest, Server } from "node:http";
import { readFileSync } from "node:fs";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Transform } from "node:stream";
import YAML from "yaml";

export const BRIDGE_PORT = 18710;
export const MUSE_PORT = 18610;
export const CLI_PORT = 8317;
const MAX_REQUEST_BYTES = 25 * 1024 * 1024;
const MAX_TASK_REPLY_BYTES = 2 * 1024 * 1024;
const SIGNED_MEDIA_LIFETIME_S = 15 * 60;

export function readClientKeys(configFile: string): string[] {
  if (!configFile) return [];
  const data = YAML.parse(readFileSync(configFile, "utf8")) as {
    access?: { "api-keys"?: unknown };
    "api-keys"?: unknown;
  } | null;
  const keys = data?.access?.["api-keys"] ?? data?.["api-keys"];
  return Array.isArray(keys) ? keys.filter(
    (key): key is string => typeof key === "string" && key.length > 0
  ) : [];
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
    /^\/v1\/videos\/task_[a-zA-Z0-9_-]+$/.test(pathname) ||
    /^\/v1\/media\/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(pathname);
}
function mediaPath(pathname: string): boolean {
  return /^\/v1\/media\/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(pathname);
}

export function createGateway(
  configFile: () => string,
  museKey: string,
  ports: { video?: number; cli?: number } = {}
): Server {
  const signingSecret = randomBytes(32);
  const quotas = new Map<string, { start: number; count: number }>();
  const hourlyLimit = Math.max(1, Number(process.env.MUSE_VIDEO_HOURLY_LIMIT || "12") || 12);

  const sign = (pathname: string, exp: number): string =>
    createHmac("sha256", signingSecret).update(pathname + ":" + exp).digest("base64url");

  const validMediaSignature = (url: URL): boolean => {
    if (!mediaPath(url.pathname)) return false;
    const expStr = url.searchParams.get("exp") ?? "";
    const signature = url.searchParams.get("sig") ?? "";
    if (!/^\d+$/.test(expStr) || !/^[a-zA-Z0-9_-]{43}$/.test(signature)) return false;
    const exp = Number(expStr);
    if (!Number.isSafeInteger(exp) || exp < Math.floor(Date.now() / 1000)) return false;
    const a = Buffer.from(signature, "ascii");
    const b = Buffer.from(sign(url.pathname, exp), "ascii");
    return a.length === b.length && timingSafeEqual(a, b);
  };

  const server = createServer((req, res) => {
    let parsed: URL;
    try {
      if (!req.url?.startsWith("/") || req.url.startsWith("//")) throw Error("Invalid URL");
      parsed = new URL(req.url, "http://127.0.0.1");
    } catch {
      res.writeHead(400).end("Invalid URL");
      return;
    }
    if (parsed.pathname === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" })
        .end(JSON.stringify({ status: "up" }));
      return;
    }
    if (!parsed.pathname.startsWith("/v1/")) {
      res.writeHead(404).end("Not found");
      return;
    }
    // Expiring signed MP4 URLs work in video players that cannot supply headers.
    const isSignedDownload = req.method === "GET" && validMediaSignature(parsed);
    let keys: string[] = [];
    if (!isSignedDownload) {
      try { keys = readClientKeys(configFile()); }
      catch { res.writeHead(503).end("CLIProxy configuration unavailable"); return; }
      if (!authorize(req.headers.authorization, keys)) {
        res.writeHead(401, { "content-type": "application/json" })
          .end(JSON.stringify({ error: { message: "Invalid CLIProxy API key", type: "authentication_error" } }));
        return;
      }
    }
    const contentLength = req.headers["content-length"];
    if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_REQUEST_BYTES)) {
      res.writeHead(413).end("Request body too large");
      req.resume();
      return;
    }
    if (!["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"].includes(req.method ?? "")) {
      res.writeHead(405).end("Method not allowed");
      req.resume();
      return;
    }
    const isVideo = videoPath(parsed.pathname);
    const port = isVideo ? (ports.video ?? MUSE_PORT) : (ports.cli ?? CLI_PORT);
    const headers = { ...req.headers, host: `127.0.0.1:${port}` };
    if (isVideo) headers.authorization = `Bearer ${museKey}`;
    delete headers.connection;
    delete headers["proxy-authorization"];
    delete headers["proxy-connection"];
    delete headers["cookie"];
    delete headers["keep-alive"];
    delete headers["upgrade"];
    delete headers["te"];
    headers["accept-encoding"] = "identity";

    // Limit submissions by CLIENT key, not Muse upstream cookie.
    if (req.method === "POST" && parsed.pathname === "/v1/videos") {
      const auth = req.headers.authorization ?? "";
      const keyHash = createHash("sha256").update(auth).digest("hex");
      const now = Date.now();
      const entry = quotas.get(keyHash);
      if (entry && now - entry.start < 3600000 && entry.count >= hourlyLimit) {
        res.writeHead(429, { "retry-after": String(Math.ceil((3600000 - (now - entry.start)) / 1000)),
          "content-type": "application/json" })
          .end(JSON.stringify({ error: { message: "Hourly video task limit reached" } }));
        req.resume();
        return;
      }
      if (quotas.size > 5000) {
        for (const [key, value] of quotas) if (now - value.start >= 3600000) quotas.delete(key);
      }
      if (!entry || now - entry.start >= 3600000) quotas.set(keyHash, { start: now, count: 1 });
      else entry.count += 1;
    }
    if (isSignedDownload) {
      parsed.searchParams.delete("sig");
      parsed.searchParams.delete("exp");
    }

    let received = 0;
    let tooLarge = false;
    const bounded = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        received += chunk.length;
        if (received > MAX_REQUEST_BYTES) {
          tooLarge = true;
          callback(new Error("Request body too large"));
          return;
        }
        callback(null, chunk);
      }
    });

    const upstream = httpRequest({
      hostname: "127.0.0.1", port, method: req.method,
      path: parsed.pathname + parsed.search, headers, timeout: 610000
    }, (reply) => {
      const responseHeaders = { ...reply.headers };
      for (const name of ["connection", "keep-alive", "proxy-authenticate",
        "proxy-authorization", "upgrade", "transfer-encoding"]) delete responseHeaders[name];
      reply.on("aborted", () => res.destroy());

      // Convert the worker's unprotected media URL to a time-limited signed URL.
      if (isVideo && /^\/v1\/videos(?:\/|$)/.test(parsed.pathname) &&
          reply.statusCode && reply.statusCode >= 200 && reply.statusCode < 300) {
        const chunks: Buffer[] = [];
        let size = 0;
        reply.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_TASK_REPLY_BYTES) {
            upstream.destroy(new Error("Video response too large"));
            return;
          }
          chunks.push(chunk);
        });
        reply.on("end", () => {
          if (res.destroyed) return;
          try {
            const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            if (value && typeof value === "object" && !Array.isArray(value)) {
              const task = value as { result?: { url?: unknown } };
              if (task.result && typeof task.result.url === "string") {
                const source = new URL(task.result.url);
                if (source.hostname === "127.0.0.1" && mediaPath(source.pathname)) {
                  const exp = Math.floor(Date.now() / 1000) + SIGNED_MEDIA_LIFETIME_S;
                  const localPort = (server.address() && typeof server.address() !== "string")
                    ? server.address()!.port : BRIDGE_PORT;
                  task.result.url = `http://127.0.0.1:${localPort}${source.pathname}?exp=${exp}&sig=${sign(source.pathname, exp)}`;
                }
              }
            }
            const output = Buffer.from(JSON.stringify(value));
            delete responseHeaders["content-length"];
            delete responseHeaders["content-encoding"];
            res.writeHead(reply.statusCode ?? 200, { ...responseHeaders,
              "content-type": "application/json", "content-length": String(output.length) });
            res.end(output);
          } catch {
            if (!res.headersSent) res.writeHead(502).end("Invalid Muse task response");
          }
        });
        return;
      }
      res.writeHead(reply.statusCode ?? 502, responseHeaders);
      reply.pipe(res);
    });
    upstream.on("timeout", () => upstream.destroy(new Error("Upstream timeout")));
    bounded.on("error", () => {
      upstream.destroy();
      if (!res.headersSent) res.writeHead(413).end("Request body too large");
      else res.destroy();
    });
    upstream.on("error", () => {
      if (tooLarge || res.writableEnded || res.destroyed) return;
      if (res.headersSent) { res.destroy(); return; }
      res.writeHead(502, { "content-type": "application/json" })
        .end(JSON.stringify({ error: { message: "Upstream unavailable" } }));
    });
    req.on("aborted", () => upstream.destroy());
    req.pipe(bounded).pipe(upstream);
  });
  return server;
}
