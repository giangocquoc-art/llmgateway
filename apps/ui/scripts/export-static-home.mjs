import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const appRoot = process.cwd();
const nextCli = resolve(appRoot, "node_modules/next/dist/bin/next");
const assetsPath = resolve(appRoot, ".open-next/assets");
const port = 3987;
const origin = `http://127.0.0.1:${port}`;
const publicPages = [
	["/", "index.html"],
	["/login", "login"],
	["/signup", "signup"],
	["/forgot-password", "forgot-password"],
	["/reset-password", "reset-password"],
];

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
	cwd: appRoot,
	stdio: "inherit",
	env: {
		...process.env,
		HOSTNAME: "127.0.0.1",
		PORT: String(port),
		HOSTED: "true",
		CLIENT_IP_HEADER: "CF-Connecting-IP",
		APP_URL: "https://ai.psharehub.com",
		GATEWAY_URL: "https://api.psharehub.com",
	},
});

try {
	await mkdir(assetsPath, { recursive: true });
	let serverReady = false;
	for (let attempt = 0; attempt < 60 && !serverReady; attempt += 1) {
		if (server.exitCode !== null) {
			throw new Error(`Next server exited with code ${server.exitCode}`);
		}
		try {
			const response = await fetch(`${origin}/api/health`, {
				signal: AbortSignal.timeout(5_000),
			});
			serverReady = response.ok;
		} catch {}
		if (!serverReady) await new Promise((resolvePromise) => setTimeout(resolvePromise, 1_000));
	}
	if (!serverReady) throw new Error("Next server did not become ready");

	for (const [route, assetName] of publicPages) {
		const response = await fetch(new URL(route, origin), {
			signal: AbortSignal.timeout(30_000),
		});
		if (!response.ok) {
			throw new Error(`Rendering ${route} returned HTTP ${response.status}`);
		}
		const html = await response.text();
		if (!html.includes("PShareHub AI Gateway") || !html.includes("__next")) {
			throw new Error(`Rendered page ${route} is missing expected app markup`);
		}
		await writeFile(resolve(assetsPath, assetName), html);
		console.log(`Exported ${route} as a static Worker asset.`);
	}
} finally {
	server.kill("SIGTERM");
}
