import { readFile, writeFile } from "node:fs/promises";

export async function patchOpenNextVercelOg(packageRoot) {
	const patchPath = `${packageRoot}/dist/cli/build/patches/ast/patch-vercel-og-library.js`;
	const original = await readFile(patchPath, "utf8");
	const edgeTrace =
		'const tracedEdgePath = path.join(path.dirname(traceInfoPath), tracedNodePath.replace("index.node.js", "index.edge.js"));';
	const edgeCopy = "copyFileSync(tracedEdgePath, outputEdgePath);";
	const wasmTrace =
		'const tracedWasmPath = path.join(path.dirname(traceInfoPath), tracedNodePath.replace("index.node.js", "yoga.wasm"));';
	const fontBlock =
		/const fontFileName = matches\[0\]\.getMatch\("PATH"\)\.text\(\);[\s\S]*?renameSync\([^;]+\);/;
	if ([edgeTrace, edgeCopy, wasmTrace].some((anchor) => !original.includes(anchor)) || !fontBlock.test(original)) {
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
	const fsImport = original.match(/import \{([^}]*)\} from "node:fs";/);
	if (!fsImport) {
		throw new Error(
			"OpenNext Vercel OG patch has no node:fs import; refusing an unsafe patch",
		);
	}
	const patched = original
		.replace(
			fsImport[0],
			fsImport[1].split(",").map((name) => name.trim()).includes("mkdirSync")
				? fsImport[0]
				: `import { ${fsImport[1].trim()}, mkdirSync } from "node:fs";`,
		)
		.replace(edgeTrace, `${edgeTrace}\n        ${fallbackBlock}`)
		.replace(edgeCopy, "// The edge bundle was copied by the fallback block above.")
		.replace(
			wasmTrace,
			'const tracedWasmPath = path.join(sourceOgPath ?? path.dirname(tracedEdgePath), "yoga.wasm");',
		)
		.replace(
			fontBlock,
			`const fontFileName = matches[0].getMatch("PATH").text();
                const stagedFontPath = path.join(buildOpts.appPath, ".psharehub-og-assets", fontFileName);
                const outputFontBinPath = path.join(outputDir, fontFileName + ".bin");
                if (existsSync(stagedFontPath) && !existsSync(outputFontBinPath)) {
                    copyFileSync(stagedFontPath, outputFontBinPath);
                }`,
		);
	await writeFile(patchPath, patched);
	return () => writeFile(patchPath, original);
}
