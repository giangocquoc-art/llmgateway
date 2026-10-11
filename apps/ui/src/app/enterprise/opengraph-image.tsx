import { ImageResponse } from "next/og";

export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function EnterpriseOgImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				background: "#101c3a",
				backgroundImage:
					"radial-gradient(900px 520px at 88% -8%, rgba(96,69,232,0.3), transparent 62%), radial-gradient(760px 520px at -6% 112%, rgba(57,198,202,0.16), transparent 60%)",
				color: "#f7f9ff",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 40,
				}}
			>
				<div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>
					<span>PShare</span>
					<span style={{ color: "#9b89ff" }}>Hub</span>
				</div>
				<h1
					style={{
						fontSize: 80,
						fontWeight: 700,
						margin: 0,
						letterSpacing: "-0.03em",
						color: "#ffffff",
					}}
				>
					PShareHub AI Gateway
				</h1>
				<p
					style={{
						fontSize: 32,
						margin: 0,
						color: "#a1a1aa",
						maxWidth: 800,
						textAlign: "center",
					}}
				>
					Cổng API hỗ trợ Anthropic Messages và OpenAI Chat Completions.
				</p>
			</div>
		</div>,
		size,
	);
}
