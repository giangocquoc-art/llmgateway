import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const appRoot = process.cwd();
const handlerPath = resolve(appRoot, ".open-next/server-functions/default/apps/ui/handler.mjs");
let handler = await readFile(handlerPath, "utf8");
const absoluteOgAssets = resolve(
	appRoot,
	".open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og",
).replaceAll("\\", "/");
const relativeOgAssets = "../../node_modules/next/dist/compiled/@vercel/og";
	const normalizedHandler = handler
		.replaceAll(`${absoluteOgAssets}/`, `${relativeOgAssets}/`)
		.replace(/(?:\.\.\/)+node_modules\/next\/dist\/compiled\/@vercel\/og\//g, `${relativeOgAssets}/`);
	handler = normalizedHandler;
	if (!handler.includes('.endsWith("preview-props")')) {
		const optionalManifestGuard = /(\w+)\.endsWith\("prefetch-hints"\)\)return\{\}/;
		if (!optionalManifestGuard.test(handler)) {
		throw new Error("OpenNext loadManifest compatibility anchor changed");
		}
		handler = handler.replace(optionalManifestGuard, '$1.endsWith("prefetch-hints")||$1.endsWith("preview-props"))return{}');
	}
if (!handler.includes(`${relativeOgAssets}/resvg.wasm?module`)) {
	throw new Error("Expected relative @vercel/og WASM imports were not found");
}
const middlewareManifestMethod = "getMiddlewareManifest(){return this.minimalMode?null:require(this.middlewareManifestPath)}";
if (handler.includes(middlewareManifestMethod)) {
	handler = handler.replace(middlewareManifestMethod, "getMiddlewareManifest(){return null}");
} else if (!handler.includes("getMiddlewareManifest(){return null}")) {
	throw new Error("OpenNext middleware manifest compatibility anchor changed");
}
await writeFile(handlerPath, handler);

const sourceOgAssets = resolve(appRoot, "node_modules/next/dist/compiled/@vercel/og");
const outputOgAssets = resolve(appRoot, ".open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og");
await mkdir(outputOgAssets, { recursive: true });
for (const asset of ["resvg.wasm", "yoga.wasm"]) {
	const source = resolve(sourceOgAssets, asset);
	const output = resolve(outputOgAssets, asset);
	try {
		await stat(output);
	} catch {
		await copyFile(source, output);
	}
}
