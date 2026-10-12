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

	const fallbackBlock = `const ogCandidates = [
			path.join(buildOpts.appPath, ".psharehub-og-assets"),
            path.join(buildOpts.appPath, ".next/standalone/apps/ui/node_modules/next/dist/compiled/@vercel/og"),
            path.join(buildOpts.appPath, "node_modules/next/dist/compiled/@vercel/og"),
            path.dirname(tracedEdgePath),
        ];
        mkdirSync(path.dirname(outputEdgePath), { recursive: true });
        let sourceOgPath;
        let sourceEdgePath;
        const ogCopyErrors = [];
        for (const candidate of ogCandidates) {
            const candidateEdgePath = path.join(candidate, "index.edge.js");
            if (!existsSync(candidateEdgePath)) continue;
            try {
                copyFileSync(candidateEdgePath, outputEdgePath);
                sourceOgPath = candidate;
                sourceEdgePath = candidateEdgePath;
                break;
            } catch (error) {
                if (error?.code !== "ENOENT") throw error;
                ogCopyErrors.push(candidateEdgePath);
            }
        }
        if (!sourceEdgePath) throw new Error("Could not copy Vercel OG edge bundle from: " + [...ogCandidates, ...ogCopyErrors].join(", "));`;
	const patched = original
		.replace(edgeTrace, `${edgeTrace}\n        ${fallbackBlock}`)
		.replace(edgeCopy, "// The edge bundle was copied by the fallback block above.")
		.replace(
			wasmTrace,
			'const tracedWasmPath = path.join(sourceOgPath ?? path.dirname(tracedEdgePath), "yoga.wasm");',
		)
		.replace(
			fontTrace,
			"const tracedFontPath = path.join(sourceOgPath ?? path.dirname(tracedEdgePath), fontFileName);",
		);
	await writeFile(patchPath, patched);
	return () => writeFile(patchPath, original);
}
