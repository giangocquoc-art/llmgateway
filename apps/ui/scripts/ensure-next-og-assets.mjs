import { access, copyFile, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, relative, resolve } from "node:path";

const appRoot = process.cwd();
const nextRoot = resolve(appRoot, "node_modules/next");
const ogRoot = resolve(nextRoot, "dist/compiled/@vercel/og");
const assets = ["index.edge.js", "resvg.wasm", "yoga.wasm", "Geist-Regular.ttf"];

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

function run(command, args, cwd) {
	return new Promise((resolvePromise, reject) => {
		const child = spawn(command, args, {
			cwd,
			shell: process.platform === "win32",
			stdio: ["ignore", "pipe", "inherit"],
		});
		let output = "";
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", (chunk) => {
			output += chunk;
		});
		child.once("error", reject);
		child.once("exit", (code, signal) => {
			if (code === 0) resolvePromise(output.trim());
			else reject(new Error(`${command} failed (${signal ?? code})`));
		});
	});
}

const missing = [];
for (const asset of assets) {
	if (!(await exists(resolve(ogRoot, asset)))) missing.push(asset);
}
if (missing.length === 0) {
	console.log(`Next ${JSON.parse(await readFile(resolve(nextRoot, "package.json"), "utf8")).version} OG assets are present.`);
	process.exit(0);
}

const nextPackage = JSON.parse(
	await readFile(resolve(nextRoot, "package.json"), "utf8"),
);
const tempRoot = await mkdtemp(resolve(tmpdir(), "psharehub-next-og-"));
try {
	const packedName = await run(
		"npm",
		["pack", `next@${nextPackage.version}`, "--pack-destination", tempRoot, "--silent"],
		appRoot,
	);
	const archivePath = resolve(tempRoot, packedName.split(/\r?\n/).at(-1));
	const packagePaths = missing.map((asset) =>
		`package/${relative(nextRoot, resolve(ogRoot, asset)).replaceAll("\\", "/")}`,
	);
	await run("tar", ["-xzf", archivePath, "-C", tempRoot, ...packagePaths], tempRoot);
	await mkdir(ogRoot, { recursive: true });
	for (const asset of missing) {
		await copyFile(resolve(tempRoot, "package", "dist/compiled/@vercel/og", asset), resolve(ogRoot, asset));
	}
	console.log(`Restored missing Next ${nextPackage.version} OG assets: ${missing.join(", ")}`);
} finally {
	await rm(tempRoot, { recursive: true, force: true });
}
