import { strict as assert } from "node:assert";
import { createServer, Server } from "node:http";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { createGateway, authorize, readClientKeys } from "./bridge";

const folder = mkdtempSync(join(tmpdir(), "muse-bridge-"));
after(() => rmSync(folder, { recursive: true, force: true }));

function serve(s: Server): Promise<number> {
  return new Promise((resolve) => {
    s.listen(0, "127.0.0.1", () => {
      const address = s.address();
      if (!address || typeof address === "string") throw new Error("Port unavailable");
      resolve(address.port);
    });
  });
}
function close(s: Server): Promise<void> {
  return new Promise((resolve, reject) => s.close((error) => error ? reject(error) : resolve()));
}
test("client key parser accepts v8 and legacy layout", () => {
  const cfg = join(folder, "config.yaml");
  writeFileSync(cfg, "access:\n  api-keys:\n    - first-key\n");
  assert.deepEqual(readClientKeys(cfg), ["first-key"]);
  writeFileSync(cfg, "api-keys:\n  - legacy-key\n");
  assert.deepEqual(readClientKeys(cfg), ["legacy-key"]);
  assert.equal(authorize("Bearer first-key", ["first-key"]), true);
  assert.equal(authorize("Bearer wrong", ["first-key"]), false);
});
test("gateway authenticates once and routes Muse video separately", async () => {
  const previousLimit = process.env.MUSE_VIDEO_HOURLY_LIMIT;
  process.env.MUSE_VIDEO_HOURLY_LIMIT = "2";
  const cli = createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ source: "cliproxy", auth: req.headers.authorization }));
  });
  const muse = createServer((req, res) => {
    if (req.url?.startsWith("/v1/media/")) {
      res.setHeader("content-type", "video/mp4");
      res.end("fake-video-data");
      return;
    }
    res.setHeader("content-type", "application/json");
    if (req.url === "/v1/videos?fail=1") {
      res.writeHead(422);
      res.end(JSON.stringify({ error: { message: "Invalid Muse prompt" } }));
      return;
    }
    if (req.url === "/v1/videos/task_signed") {
      res.end(JSON.stringify({
        id: "task_signed", status: "succeeded",
        result: { url: "http://127.0.0.1:18710/v1/media/vid_sample.mp4" }
      }));
      return;
    }
    res.end(JSON.stringify({ source: "muse", auth: req.headers.authorization, path: req.url }));
  });
  const cliPort = await serve(cli);
  const musePort = await serve(muse);
  try {
  const cfg = join(folder, "route.yaml");
  writeFileSync(cfg, "access:\n  api-keys:\n    - valid-client-key\n");
  const quotaFile = join(folder, "video-quota.json");
  const bridge = createGateway(() => cfg, "internal-test-key", { cli: cliPort, video: musePort, quotaFile });
  if (previousLimit === undefined) delete process.env.MUSE_VIDEO_HOURLY_LIMIT;
  else process.env.MUSE_VIDEO_HOURLY_LIMIT = previousLimit;
  const port = await serve(bridge);
  const base = `http://127.0.0.1:${port}`;
  try {
    const denied = await fetch(base + "/v1/videos", { headers: { Authorization: "Bearer wrong-key" } });
    assert.equal(denied.status, 401);
    const rejected = await fetch(base + "/v1/videos?fail=1", {
      method: "POST", headers: { Authorization: "Bearer valid-client-key" },
      body: JSON.stringify({ prompt: "invalid" })
    });
    assert.equal(rejected.status, 422);
    const video = await fetch(base + "/v1/videos?test=1", {
      method: "POST", headers: { Authorization: "Bearer valid-client-key" },
      body: JSON.stringify({ prompt: "test" })
    });
    assert.equal(video.status, 200);
    assert.deepEqual(await video.json(), {
      source: "muse", auth: "Bearer internal-test-key", path: "/v1/videos?test=1"
    });
    const allowed = await fetch(base + "/v1/videos", {
      method: "POST", headers: { Authorization: "Bearer valid-client-key" },
      body: JSON.stringify({ prompt: "second" })
    });
    assert.equal(allowed.status, 200);
    assert.equal(existsSync(quotaFile), true);
    const limited = await fetch(base + "/v1/videos", {
      method: "POST", headers: { Authorization: "Bearer valid-client-key" },
      body: JSON.stringify({ prompt: "third" })
    });
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get("retry-after"));
    const status = await fetch(base + "/v1/videos/task_1", {
      headers: { Authorization: "Bearer valid-client-key" }
    });
    assert.equal((await status.json() as { source: string }).source, "muse");
    const chat = await fetch(base + "/v1/chat/completions", {
      headers: { Authorization: "Bearer valid-client-key" }
    });
    assert.deepEqual(await chat.json(), { source: "cliproxy", auth: "Bearer valid-client-key" });
    const videoResult = await fetch(base + "/v1/videos/task_signed", {
      headers: { Authorization: "Bearer valid-client-key" }
    });
    const finished = await videoResult.json() as { result: { url: string } };
    const signed = new URL(finished.result.url);
    assert.equal(signed.origin, base);
    assert.ok(signed.searchParams.has("exp"));
    assert.ok(signed.searchParams.has("sig"));
    const videoDownload = await fetch(signed);
    assert.equal(videoDownload.status, 200);
    assert.equal(await videoDownload.text(), "fake-video-data");
    const tampered = new URL(signed);
    tampered.searchParams.set("sig", "a".repeat(43));
    assert.equal((await fetch(tampered)).status, 401);
    const rawMedia = await fetch(base + "/v1/media/vid_sample.mp4");
    assert.equal(rawMedia.status, 401);
    const privateAdmin = await fetch(base + "/admin/accounts", {
      headers: { Authorization: "Bearer valid-client-key" }
    });
    assert.equal(privateAdmin.status, 404);
    const huge = await fetch(base + "/v1/videos", {
      method: "POST",
      headers: { Authorization: "Bearer valid-client-key" },
      body: "x".repeat(26 * 1024 * 1024)
    });
    assert.equal(huge.status, 413);
    const missing = await fetch(base + "/v1/videos", { method: "POST", body: "{}" });
    assert.equal(missing.status, 401);
  } finally {
    await close(bridge);
  }
  // Keep mock upstream services alive while testing the re-created bridge.
  const restarted = createGateway(() => cfg, "internal-test-key", {
    video: musePort, cli: cliPort, quotaFile
  });
  try {
    const restartPort = await serve(restarted);
    const limitAfterRestart = await fetch(`http://127.0.0.1:${restartPort}/v1/videos`, {
      method: "POST", headers: { Authorization: "Bearer valid-client-key" },
      body: JSON.stringify({ prompt: "after restart" })
    });
    assert.equal(limitAfterRestart.status, 429);
  } finally {
    await close(restarted);
  }
  } finally {
    await Promise.all([close(cli), close(muse)]);
  }
});
