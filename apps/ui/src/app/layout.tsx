import localFont from "next/font/local";

import { Providers } from "@/components/providers";
import { getConfig } from "@/lib/config-server";
import { fetchSystemBanner } from "@/lib/system-banner";
import { getTimeZonePreference } from "@/lib/timezone-server";

import { MARKETING_STATS } from "@llmgateway/shared";

import "./globals.css";
import "./psharehub-brand-fonts.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const geistMono = localFont({
	// globals.css maps the Tailwind token: --font-mono: var(--font-geist-mono).
	// Registering the font under --font-mono directly would leave that theme
	// mapping dangling and every `font-mono` element falls back to sans.
	variable: "--font-geist-mono",
	src: "../../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
	weight: "100 900",
	display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	metadataBase: new URL("https://ai.psharehub.com"),
	title: {
		default: `PShareHub AI Gateway — Open-Source AI Gateway for ${MARKETING_STATS.models} Models`,
		template: "%s | PShareHub AI Gateway",
	},
	description: `Open-source AI gateway: route requests to ${MARKETING_STATS.models} models from ${MARKETING_STATS.providers} providers, including OpenAI, Anthropic and Google, through one OpenAI-compatible API.`,
	authors: [{ name: "PShareHub AI Gateway" }],
	creator: "PShareHub AI Gateway",
	publisher: "PShareHub AI Gateway",
	icons: {
		icon: [
			{ url: "/favicon/chui-brand-mark.svg", type: "image/svg+xml" },
			{
				url: "/favicon/favicon-16x16.png?v=1",
				sizes: "16x16",
				type: "image/png",
			},
			{
				url: "/favicon/favicon-32x32.png?v=1",
				sizes: "32x32",
				type: "image/png",
			},
		],
		apple: [{ url: "/favicon/apple-touch-icon.png?v=1", sizes: "180x180" }],
	},
	manifest: "/favicon/site.webmanifest?v=1",
	alternates: {
		canonical: "./",
	},
	openGraph: {
		title: `PShareHub AI Gateway — Open-Source AI Gateway for ${MARKETING_STATS.models} Models`,
		description: `Open-source AI gateway: route requests to ${MARKETING_STATS.models} models from ${MARKETING_STATS.providers} providers, including OpenAI, Anthropic and Google, through one OpenAI-compatible API.`,
		type: "website",
		url: "https://ai.psharehub.com",
		siteName: "PShareHub AI Gateway",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: `PShareHub AI Gateway — Open-Source AI Gateway for ${MARKETING_STATS.models} Models`,
		description: `Open-source AI gateway: route requests to ${MARKETING_STATS.models} models from ${MARKETING_STATS.providers} providers through one OpenAI-compatible API.`,
		creator: "@psharehub",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": "https://ai.psharehub.com/#website",
	publisher: { "@type": "Organization", name: "PShareHub AI Gateway" },
	name: "PShareHub AI Gateway",
	alternateName: ["PShareHub AI Gateway", "ai.psharehub.com"],
	url: "https://ai.psharehub.com",
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://ai.psharehub.com/models?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
};

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	const config = getConfig();
	const [timeZone, systemBanner] = await Promise.all([
		getTimeZonePreference(),
		fetchSystemBanner(),
	]);

	return (
		<html lang="en" className={geistMono.variable} suppressHydrationWarning>
			<head>
				<link
					rel="service-desc"
					type="application/vnd.oai.openapi+json"
					href="/openapi.json"
				/>
				<link rel="service-doc" href="/developers" />
				<link rel="preconnect" href="https://internal.llmgateway.io" />
				<link rel="preconnect" href="https://docs.llmgateway.io" />
				<script
					type="application/ld+json"
					// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema),
					}}
				/>
			</head>
			<body className="min-h-screen antialiased">
				<Providers
					config={config}
					timeZone={timeZone}
					systemBanner={systemBanner}
				>
					{children}
				</Providers>
			</body>
		</html>
	);
}
