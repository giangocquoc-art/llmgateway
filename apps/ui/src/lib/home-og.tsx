import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { ogSize } from "@/lib/og";

import type { ReactNode } from "react";

const INK = "#101c3a";
const PAPER = "#f7f9ff";
const MUTED = "rgba(226,232,255,0.78)";
const FAINT = "rgba(226,232,255,0.48)";

const BARCODE = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 4, 1, 2];

function Barcode({ color }: { color: string }) {
	return (
		<div style={{ display: "flex", alignItems: "stretch", height: 30, gap: 3 }}>
			{BARCODE.map((width, index) => (
				<div
					key={index}
					style={{ width, height: 30, background: color, display: "flex" }}
				/>
			))}
		</div>
	);
}

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				display: "flex",
				fontFamily: "Mono",
				fontSize: 17,
				letterSpacing: "0.2em",
				textTransform: "uppercase",
				color: FAINT,
			}}
		>
			{children}
		</div>
	);
}

async function renderCard({
	glow,
	children,
}: {
	glow: string;
	children: ReactNode;
}) {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				background: INK,
				backgroundImage: `radial-gradient(900px 520px at 88% -8%, ${glow}, transparent 62%), radial-gradient(760px 520px at -6% 112%, rgba(57,198,202,0.14), transparent 60%)`,
				color: PAPER,
				fontFamily: "sans-serif",
				padding: "56px 64px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>
					<span>PShare</span>
					<span style={{ color: "#9b89ff" }}>Hub</span>
				</div>
				<div
					style={{
						display: "flex",
						fontFamily: "Mono",
						fontSize: 18,
						color: MUTED,
					}}
				>
					ai.psharehub.com
				</div>
			</div>
			{children}
		</div>,
		ogSize,
	);
}

export async function homeOgImage() {
	return await renderCard({
		glow: "rgba(96,69,232,0.24)",
		children: (
			<div
				style={{
					display: "flex",
					flex: 1,
					alignItems: "center",
					justifyContent: "space-between",
					gap: 32,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: 640,
						gap: 20,
					}}
				>
					<Eyebrow>PShareHub AI Gateway · Bản xem trước</Eyebrow>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							fontSize: 62,
							fontWeight: 800,
							letterSpacing: "-0.045em",
							lineHeight: 1.02,
						}}
					>
						<span>Một API,</span>
						<span
							style={{
								fontFamily: "Serif",
								fontStyle: "italic",
								fontWeight: 400,
								letterSpacing: "-0.02em",
								color: "#39c6ca",
								marginTop: 6,
							}}
						>
							nhiều giao thức.
						</span>
					</div>
					<div
						style={{
							display: "flex",
							fontSize: 23,
							lineHeight: 1.4,
							color: MUTED,
						}}
					>
						Cổng API xem trước hỗ trợ Anthropic Messages và OpenAI Chat
						Completions. Cần cấu hình quyền truy cập upstream để xử lý yêu cầu.
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: 396,
						borderRadius: 22,
						background: "#ffffff",
						color: INK,
						padding: "26px 28px",
						boxShadow: "0 40px 90px -30px rgba(96,69,232,0.3)",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							fontFamily: "Mono",
							fontSize: 13,
							letterSpacing: "0.18em",
							color: "rgba(16,28,58,0.62)",
						}}
					>
						<span>● API GATEWAY</span>
						<span>PREVIEW</span>
					</div>
					<div
						style={{
							display: "flex",
							marginTop: 16,
							fontSize: 28,
							fontWeight: 800,
							letterSpacing: "-0.035em",
						}}
					>
						Giao thức tích hợp
					</div>
					{[
						["ANTHROPIC", "Messages API"],
						["OPENAI", "Chat Completions"],
						["UPSTREAM", "Cần cấu hình khóa"],
					].map(([when, what]) => (
						<div
							key={when}
							style={{
								display: "flex",
								alignItems: "baseline",
								gap: 18,
								marginTop: 14,
							}}
						>
							<span
								style={{
									display: "flex",
									width: 110,
									fontFamily: "Mono",
									fontSize: 14,
									letterSpacing: "0.12em",
									color: "#6045e8",
								}}
							>
								{when}
							</span>
							<span style={{ display: "flex", fontSize: 20 }}>{what}</span>
						</div>
					))}
					<div
						style={{
							display: "flex",
							marginTop: 22,
							borderTop: "2px dashed rgba(16,28,58,0.16)",
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginTop: 20,
							padding: "14px 0",
							borderRadius: 999,
							background: "#6045e8",
							color: "#ffffff",
							fontSize: 20,
							fontWeight: 800,
						}}
					>
						API hỗ trợ Anthropic và OpenAI
					</div>
				</div>
			</div>
		),
	});
}

export interface ProductOgOptions {
	gate: string;
	audience: string;
	title: string;
	titleAccent: string;
	subtitle: string;
	screenshot: string;
	accent: string;
	glow: string;
}

export async function productOgImage({
	gate,
	audience,
	title,
	titleAccent,
	subtitle,
	screenshot,
	accent,
	glow,
}: ProductOgOptions) {
	const image = await readFile(
		join(process.cwd(), "public/home/products", screenshot),
	);
	return await renderCard({
		glow,
		children: (
			<div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						flex: 1,
						alignItems: "center",
						justifyContent: "space-between",
						gap: 36,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: 470,
							gap: 20,
						}}
					>
						<Eyebrow>{audience}</Eyebrow>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								fontSize: 60,
								fontWeight: 800,
								letterSpacing: "-0.045em",
								lineHeight: 1.04,
							}}
						>
							<span>{title}</span>
							<span
								style={{
									fontFamily: "Serif",
									fontStyle: "italic",
									fontWeight: 400,
									letterSpacing: "-0.02em",
									color: accent,
									marginTop: 4,
								}}
							>
								{titleAccent}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								fontSize: 22,
								lineHeight: 1.42,
								color: MUTED,
							}}
						>
							{subtitle}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							width: 560,
							height: 280,
							borderRadius: 16,
							overflow: "hidden",
							border: "1px solid rgba(255,255,255,0.14)",
							boxShadow: `0 40px 90px -30px ${glow}`,
						}}
					>
						<img
							src={`data:image/webp;base64,${image.toString("base64")}`}
							width={560}
							height={280}
							alt=""
						/>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						paddingTop: 22,
						borderTop: "2px dashed rgba(244,241,232,0.16)",
					}}
				>
					<div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
						<span
							style={{
								fontFamily: "Serif",
								fontStyle: "italic",
								fontSize: 52,
								lineHeight: 1,
								color: accent,
							}}
						>
							{gate}
						</span>
						<span
							style={{
								fontFamily: "Mono",
								fontSize: 15,
								letterSpacing: "0.2em",
								color: FAINT,
							}}
						>
							GATE
						</span>
					</div>
					<Barcode color="rgba(244,241,232,0.5)" />
				</div>
			</div>
		),
	});
}
