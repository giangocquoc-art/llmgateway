import { spawn } from "node:child_process";
import { lstat, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = process.cwd();
const repoRoot = resolve(appRoot, "../..");
const pnpmStore = resolve(repoRoot, "node_modules/.pnpm");
const appModules = resolve(appRoot, "node_modules");
const disabledLinks = [];
let patchedBundleServer;

function run(command, args) {
	return new Promise((resolvePromise, reject) => {
		const child = spawn(command, args, {
			cwd: appRoot,
			stdio: "inherit",
		});
		child.once("error", reject);
		child.once("exit", (code, signal) => {
			if (code === 0) resolvePromise();
			else reject(new Error(`${command} failed (${signal ?? code})`));
		});
	});
}

async function hideOptionalSharpLinks(directory) {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		const path = resolve(directory, entry.name);
		if (entry.isSymbolicLink()) {
			const isSharp = entry.name === "sharp" ||
				(entry.name.startsWith("sharp-") && directory.endsWith(`${process.platform === "win32" ? "\\" : "/"}@img`));
			if (!isSharp) continue;
			const hiddenPath = `${path}.psharehub-build-disabled`;
			await rename(path, hiddenPath);
			disabledLinks.push([hiddenPath, path]);
		} else if (entry.isDirectory()) {
			await hideOptionalSharpLinks(path);
		}
	}
}

async function main() {
	await run(process.execPath, ["scripts/copy-standalone-assets.mjs"]);
	await hideOptionalSharpLinks(pnpmStore);
	await hideOptionalSharpLinks(appModules);
	const packageEntry = fileURLToPath(import.meta.resolve("@opennextjs/cloudflare"));
	const packageRoot = resolve(dirname(packageEntry), "../..");
	const cli = resolve(packageRoot, "dist/cli/index.js");
	const bundleServerPath = resolve(packageRoot, "dist/cli/build/bundle-server.js");
	const bundleServerSource = await readFile(bundleServerPath, "utf8");
	const edgeRuntimeAlias = '"next/dist/compiled/edge-runtime": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),';
	if (!bundleServerSource.includes(edgeRuntimeAlias)) {
		throw new Error("OpenNext bundle-server alias anchor changed; refusing an unsafe patch");
	}
	const sharpAliases = [
		'"sharp": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-win32-x64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-linux-x64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-linux-arm64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-darwin-arm64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-darwin-x64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-libvips-linux-x64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
		'"@img/sharp-libvips-linux-arm64": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),',
	].join("\n            ");
	patchedBundleServer = [bundleServerPath, bundleServerSource];
	await writeFile(bundleServerPath, bundleServerSource.replace(edgeRuntimeAlias, `${edgeRuntimeAlias}\n            ${sharpAliases}`));
	await run(process.execPath, [cli, "build", "--skipNextBuild"]);
	await run(process.execPath, ["scripts/export-static-home.mjs"]);
	await run(process.execPath, ["scripts/patch-wrangler-windows-assets.mjs"]);
}

try {
	await main();
} finally {
	if (patchedBundleServer) {
		await writeFile(patchedBundleServer[0], patchedBundleServer[1]);
	}
	for (const [hiddenPath, originalPath] of disabledLinks.reverse()) {
		try {
			await lstat(hiddenPath);
			await rename(hiddenPath, originalPath);
		} catch (error) {
			if (error?.code !== "ENOENT") throw error;
		}
	}
}
