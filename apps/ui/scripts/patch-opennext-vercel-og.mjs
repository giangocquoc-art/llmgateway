import { readFile, writeFile } from "node:fs/promises";

export async function patchOpenNextVercelOg(packageRoot) {
	const patchPath = `${packageRoot}/dist/cli/build/patches/ast/patch-vercel-og-library.js`;
	const original = await readFile(patchPath, "utf8");
	const edgeTrace =
		'const tracedEdgePath = path.join(path.dirname(traceInfoPath), tracedNodePath.replace("index.node.js", "index.edge.js"));';
	const edgeCopy = "copyFileSync(tracedEdgePath, outputEdgePath);";
	const wasmTrace =
		'const tracedWasmPath = path.join(path.dirname(traceInfoPath), tracedNodePath.replace("index.node.js", "yoga.wasm"));';
	const fontTrace =
		"const tracedFontPath = path.join(path.dirname(tracedEdgePath), fontFileName);";
	if (
		[edgeTrace, edgeCopy, wasmTrace].some(
			(anchor) => !original.includes(anchor),
		)
	) {
		throw new Error(
			"OpenNext Vercel OG patch anchors changed; refusing an unsafe patch",
		);
	}

	const fallbackBlock = `const nextOgPath = path.join(buildOpts.appPath, "node_modules/next/dist/compiled/@vercel/og");
        const standalonePackagePath = getPackagePath(buildOpts).replace("/.next", "");
        const standaloneOgPath = path.join(buildOpts.appPath, ".next/standalone", standalonePackagePath, "node_modules/next/dist/compiled/@vercel/og");
        const sourceOgPath = existsSync(path.join(nextOgPath, "index.edge.js")) ? nextOgPath : standaloneOgPath;
        const sourceEdgePath = existsSync(tracedEdgePath) ? tracedEdgePath : path.join(sourceOgPath, "index.edge.js");
        if (!existsSync(sourceEdgePath)) throw new Error("Missing Vercel OG edge bundle at " + sourceEdgePath);`;
	const patched = original
		.replace(edgeTrace, `${edgeTrace}\n        ${fallbackBlock}`)
		.replace(edgeCopy, "copyFileSync(sourceEdgePath, outputEdgePath);")
		.replace(
			wasmTrace,
			'const tracedWasmPath = path.join(sourceOgPath, "yoga.wasm");',
		)
		.replace(
			fontTrace,
			"const tracedFontPath = path.join(sourceOgPath, fontFileName);",
		);
	await writeFile(patchPath, patched);
	return () => writeFile(patchPath, original);
}