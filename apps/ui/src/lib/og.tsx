import { ImageResponse } from "next/og";

import { MARKETING_STATS } from "@llmgateway/shared";

export const ogSize = {
	width: 1200,
	height: 630,
};

export const ogContentType = "image/png";

interface OgImageOptions {
	eyebrow: string;
	title: string;
	subtitle: string;
}

/**
 * Shared OpenGraph image template so every marketing page renders a
 * consistent PShareHub branded 1200x630 card. Keep this template to text and
 * CSS primitives because Satori cannot reliably render the mascot's embedded
 * WebP SVG on Cloudflare Workers.
 */
export function ogImage({ eyebrow, title, subtitle }: OgImageOptions) {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				position: "relative",
				background: "#101c3a",
				backgroundImage:
					"radial-gradient(1100px 620px at 82% -12%, rgba(96,69,232,0.28), transparent 60%), radial-gradient(900px 620px at -8% 112%, rgba(57,198,202,0.16), transparent 55%)",
				color: "#ffffff",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				padding: 72,
				boxSizing: "border-box",
			}}
		>
			{/* Header uses a text lockup so Satori does not need to parse the mascot SVG. */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 18,
				}}
			>
				<div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>
					<span>PShare</span>
					<span style={{ color: "#9b89ff" }}>Hub</span>
				</div>
				<span style={{ color: "rgba(255,255,255,0.4)", fontSize: 24 }}>/</span>
				<span style={{ color: "rgba(226,232,255,0.72)", fontSize: 24 }}>
					{eyebrow}
				</span>
			</div>

			{/* Main: title + subtitle */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 24,
					maxWidth: 940,
				}}
			>
				<h1
					style={{
						fontSize: 78,
						fontWeight: 800,
						letterSpacing: "-0.03em",
						lineHeight: 1.05,
						margin: 0,
						color: "#ffffff",
					}}
				>
					{title}
				</h1>
				<p
					style={{
						fontSize: 30,
						lineHeight: 1.35,
						margin: 0,
						maxWidth: 840,
						color: "#9CA3AF",
					}}
				>
					{subtitle}
				</p>
			</div>

			{/* Footer */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					fontSize: 22,
					color: "#9CA3AF",
				}}
			>
				<span style={{ color: "#ffffff", fontWeight: 600 }}>
					ai.psharehub.com
				</span>
				<span>{`Một API. ${MARKETING_STATS.models} mô hình.`}</span>
			</div>
		</div>,
		ogSize,
	);
}
