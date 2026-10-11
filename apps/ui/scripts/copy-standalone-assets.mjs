import { cp, lstat, mkdir, readFile, readdir, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const appRoot = process.cwd();
const staticAssets = resolve(appRoot, ".next/static");
const publicAssets = resolve(appRoot, "public");
const standaloneRoot = resolve(appRoot, ".next/standalone/apps/ui");
const standaloneNext = resolve(standaloneRoot, ".next");
const standaloneModules = resolve(appRoot, ".next/standalone/node_modules");
const openNextOgOutput = resolve(appRoot, ".open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og");

for (const path of [staticAssets, publicAssets]) {
	try {
		await stat(path);
	} catch {
		throw new Error(`Required build asset directory is missing: ${path}`);
	}
}

// OpenNext handles /_next/image through Cloudflare's image service. Next's
// shared server trace still includes Sharp as an optional native optimizer,
// which cannot run in Workers and is not used by this adapter.
const nextServerTrace = resolve(appRoot, ".next/next-server.js.nft.json");
try {
	const trace = JSON.parse(await readFile(nextServerTrace, "utf8"));
	trace.files = trace.files.filter(
		(path) =>
			!/(?:^|\/)node_modules\/(?:sharp|@img\/sharp-[^/]+)(?:\/|$)/.test(path) &&
			!/(?:^|\/)next\/dist\/server\/image-optimizer(?:\.js|\/)/.test(path),
	);
	await writeFile(nextServerTrace, `${JSON.stringify(trace)}\n`);
} catch (error) {
	if (error?.code !== "ENOENT") throw error;
}

await mkdir(standaloneNext, { recursive: true });
await cp(staticAssets, resolve(standaloneNext, "static"), { recursive: true });
await cp(publicAssets, resolve(standaloneRoot, "public"), { recursive: true });
await mkdir(openNextOgOutput, { recursive: true });

async function materializeSymlinks(directory) {
	try {
		await stat(directory);
	} catch {
		return;
	}
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = resolve(directory, entry.name);
		if (entry.isSymbolicLink()) {
			const source = await realpath(path);
			const temporary = `${path}.materialized-${process.pid}`;
			await cp(source, temporary, { recursive: true, dereference: true });
			await rm(path, { recursive: true, force: true });
			await rename(temporary, path);
		} else if (entry.isDirectory()) {
			await materializeSymlinks(path);
		}
	}
}

await materializeSymlinks(resolve(standaloneModules, ".pnpm"));
await materializeSymlinks(standaloneModules);
await materializeSymlinks(resolve(standaloneRoot, "node_modules"));
await materializeSymlinks(resolve(standaloneNext, "node_modules"));

async function removeNativeSharp(directory) {
	try {
		await stat(directory);
	} catch {
		return;
	}
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = resolve(directory, entry.name);
		const isPnpmSharpPackage =
			entry.isDirectory() &&
			path.includes(`${resolve(standaloneModules, ".pnpm")}\\`) &&
			(/^(?:sharp@|@img\+sharp-)/.test(entry.name));
		const isSharpModule = entry.isDirectory() && entry.name === "sharp";
		const isSharpPlatformModule =
			entry.isDirectory() &&
			entry.name.startsWith("sharp-") &&
			(directory.split(/[\\/]/).at(-1) === "@img" ||
				path.includes(`${resolve(standaloneModules, ".pnpm")}\\@img\\`));
		if (isPnpmSharpPackage || isSharpModule || isSharpPlatformModule) {
			await rm(path, { recursive: true, force: true });
		} else if (entry.isDirectory()) {
			await removeNativeSharp(path);
		}
	}
}

await removeNativeSharp(standaloneModules);
await removeNativeSharp(resolve(standaloneRoot, "node_modules"));
await removeNativeSharp(resolve(standaloneNext, "node_modules"));
