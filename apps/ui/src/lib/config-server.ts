export interface AppConfig {
	hosted: boolean;
	appUrl: string;
	apiUrl: string;
	apiBackendUrl: string;
	gatewayUrl: string;
	githubUrl: string;
	discordUrl: string;
	twitterUrl: string;
	docsUrl: string;
	playgroundUrl: string;
	devpassUrl: string;
	airsideUrl: string;
	adminUrl: string;
	posthogKey?: string;
	posthogHost?: string;
	githubAuth: boolean;
	googleAuth: boolean;
	ssoEnabled: boolean;
	chatSupportEnabled: boolean;
}

export function getConfig(): AppConfig {
	const apiUrl = process.env.API_URL ?? "https://api.psharehub.com";
	return {
		hosted: process.env.HOSTED === "true",
		appUrl: process.env.APP_URL ?? "https://ai.psharehub.com",
		apiUrl,
		apiBackendUrl: process.env.API_BACKEND_URL ?? apiUrl,
		gatewayUrl: process.env.GATEWAY_URL ?? "https://api.psharehub.com",
		githubUrl:
			process.env.GITHUB_URL ?? "https://github.com/giangocquoc-art/llmgateway",
		discordUrl: process.env.DISCORD_URL ?? "",
		twitterUrl: process.env.TWITTER_URL ?? "",
		docsUrl:
			process.env.DOCS_URL ??
			"https://github.com/giangocquoc-art/llmgateway#readme",
		playgroundUrl:
			process.env.PLAYGROUND_URL ?? "https://api.psharehub.com/admin/studio/",
		devpassUrl: process.env.CODE_URL ?? "",
		airsideUrl: process.env.AIRSIDE_URL ?? "",
		adminUrl: process.env.ADMIN_URL ?? "https://api.psharehub.com/admin",
		posthogKey: process.env.POSTHOG_KEY,
		posthogHost: process.env.POSTHOG_HOST,
		githubAuth: !!process.env.GITHUB_CLIENT_ID,
		googleAuth: !!process.env.GOOGLE_CLIENT_ID,
		ssoEnabled: process.env.SSO_ENABLED === "true",
		chatSupportEnabled: process.env.CHAT_SUPPORT_ENABLED !== "false",
	};
}
