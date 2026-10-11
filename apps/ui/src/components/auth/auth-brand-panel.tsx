import { Zap, Shield, Globe } from "lucide-react";
import Image from "next/image";

import { PShareHubLogo } from "@/components/branding/psharehub-logo";

import { MARKETING_STATS } from "@llmgateway/shared";

export async function AuthBrandPanel({
	variant,
}: {
	variant: "login" | "signup";
}) {
	return (
		<div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#f6f4ee] via-white to-[#e8e2ff] dark:from-[#151c38] dark:via-[#101c3a] dark:to-[#24315c] lg:flex lg:flex-col lg:justify-between">
			{/* Decorative grid */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(96,69,232,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(96,69,232,.08) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>
			{/* Gradient orbs */}
			<div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-[128px]" />
			<div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#d9eee0]/70 blur-[128px] dark:bg-primary/15" />
			<Image
				src="/favicon/chui-web-v21.webp"
				alt=""
				aria-hidden="true"
				width={330}
				height={392}
				priority
				className="pointer-events-none absolute bottom-8 right-6 z-0 h-[min(36vh,360px)] w-auto object-contain opacity-90 xl:right-12"
			/>

			<div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
				<div>
					<div className="mb-8">
						<PShareHubLogo />
					</div>
					{variant === "signup" ? (
						<>
							<p className="font-display text-4xl font-bold leading-tight tracking-tight text-[#151c38] dark:text-white xl:text-5xl">
								One API for
								<br />
								{MARKETING_STATS.models} models.
							</p>
							<p className="mt-4 max-w-md text-lg text-[#5d6680] dark:text-[#b9c2dd]">
								Route requests across providers, cut costs with smart caching,
								and ship AI features without vendor lock-in.
							</p>
						</>
					) : (
						<>
							<p className="font-display text-4xl font-bold leading-tight tracking-tight text-[#151c38] dark:text-white xl:text-5xl">
								Welcome back.
							</p>
							<p className="mt-4 max-w-md text-lg text-[#5d6680] dark:text-[#b9c2dd]">
								Pick up where you left off.
							</p>
						</>
					)}
				</div>

				{variant === "signup" && (
					<div className="mt-12 grid grid-cols-3 gap-6">
						<div className="rounded-lg border border-[#d9d8d1] bg-white/75 p-4 dark:border-white/10 dark:bg-[#151c38]/75">
							<Zap className="mb-2 h-5 w-5 text-primary" />
							<p className="text-2xl font-bold tabular-nums text-[#151c38] dark:text-white">
								{MARKETING_STATS.tokensRouted}
							</p>
							<p className="text-xs text-[#5d6680] dark:text-[#b9c2dd]">
								Tokens routed
							</p>
						</div>
						<div className="rounded-lg border border-[#d9d8d1] bg-white/75 p-4 dark:border-white/10 dark:bg-[#151c38]/75">
							<Shield className="mb-2 h-5 w-5 text-accent" />
							<p className="text-2xl font-bold tabular-nums text-[#151c38] dark:text-white">
								{MARKETING_STATS.models}
							</p>
							<p className="text-xs text-[#5d6680] dark:text-[#b9c2dd]">
								Models
							</p>
						</div>
						<div className="rounded-lg border border-[#d9d8d1] bg-white/75 p-4 dark:border-white/10 dark:bg-[#151c38]/75">
							<Globe className="mb-2 h-5 w-5 text-[#39c6ca]" />
							<p className="text-2xl font-bold tabular-nums text-[#151c38] dark:text-white">
								{MARKETING_STATS.providers}
							</p>
							<p className="text-xs text-[#5d6680] dark:text-[#b9c2dd]">
								LLM providers
							</p>
						</div>
					</div>
				)}

				<div className="mt-8 flex items-center gap-3 rounded-lg border border-[#e5eafb] bg-white/70 p-4 dark:border-white/10 dark:bg-[#151c38]/70">
					<Image
						src="/favicon/chui-brand-mark.svg"
						alt=""
						aria-hidden="true"
						width={40}
						height={40}
						className="size-10 shrink-0"
					/>
					<p className="font-display text-sm font-semibold text-[#101c3a] dark:text-white">
						Chia sẻ tri thức <span className="text-primary">·</span> Kiến tạo
						giá trị
					</p>
				</div>
			</div>

			<div className="relative z-10 px-12 pb-8 xl:px-16">
				<p className="text-xs text-[#586580] dark:text-zinc-400">
					PShareHub <span className="text-primary">·</span> Đồng hành cùng Chúi
				</p>
			</div>
		</div>
	);
}
