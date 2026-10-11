import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { DashboardDemo } from "@/components/home/dashboard-demo";
import { ShimmerButton } from "@/lib/components/shimmer-button";

const STATS = [
	{ value: "Anthropic", label: "API Messages" },
	{ value: "OpenAI", label: "Tương thích Chat Completions" },
	{ value: "Streaming", label: "Responses" },
	{ value: "Fallback", label: "Tuyến upstream đã cấu hình" },
];

export function LandingHero() {
	return (
		<div className="overflow-hidden">
			<div
				aria-hidden
				className="z-2 absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
			>
				<div className="w-140 h-320 -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
				<div className="h-320 absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
				<div className="h-320 -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
			</div>
			<section>
				{/* pt-36 (not pt-24) on mobile clears the Runware promo banner
						    stacked above the fixed navbar; revert when the promo ends. */}
				<div className="relative pt-36">
					<div
						aria-hidden
						className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
					/>
					<div className="mx-auto max-w-7xl px-6">
						{/* Announcement badge - centered */}
						<div className="mb-10 lg:mb-12 flex justify-center">
							<div className="animate-hero-enter">
								<div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/75 px-4 py-2 shadow-sm shadow-[#101c3a]/5">
									<Image
										src="/favicon/chui-brand-mark.svg"
										alt=""
										aria-hidden="true"
										width={22}
										height={22}
									/>
									<span className="text-sm font-medium text-foreground">
										PShareHub AI Gateway
									</span>
								</div>
							</div>
						</div>

						{/* Centered hero content - optimized for conversion */}
						<div className="text-center max-w-4xl mx-auto">
							<div>
								<h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
									PShareHub AI Gateway
								</h1>
								<p className="mt-4 md:mt-6 max-w-2xl mx-auto text-balance text-base md:text-lg text-muted-foreground">
									Bản xem trước cổng API hỗ trợ Anthropic Messages và OpenAI
									Chat Completions. Yêu cầu được chuyển qua các tuyến upstream
									do người vận hành cấu hình. Quyền truy cập công khai và giá
									dịch vụ chưa được công bố.
								</p>
							</div>

							{/* Primary CTA - Maximum prominence */}
							<div className="animate-hero-enter hero-enter-delay-1 mt-8 md:mt-10 flex flex-col items-center gap-6">
								{/* Primary CTA - ShimmerButton with glow */}
								<div className="relative">
									{/* Outer glow ring */}
									<div className="absolute -inset-3 animate-pulse rounded-full bg-[#ffad4e]/30 blur-xl" />
									<a
										href="https://api.psharehub.com/admin/studio/"
										className="group relative"
									>
										<ShimmerButton
											background="#6045e8"
											className="px-10 py-3 shadow-2xl shadow-[#6045e8]/25 md:px-12 md:py-4"
										>
											<span className="flex items-center gap-3 text-center text-xl leading-none font-bold tracking-tight whitespace-pre-wrap text-white md:text-2xl">
												<span>Mở Gateway Console</span>
												<ArrowRight className="size-6 md:size-7 transition-transform group-hover:translate-x-1" />
											</span>
										</ShimmerButton>
									</a>
								</div>

								{/* Trust indicators */}
								<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
									<span className="flex items-center gap-1.5">
										<svg
											className="size-4 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										API Anthropic Messages
									</span>
									<span className="flex items-center gap-1.5">
										<svg
											className="size-4 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										OpenAI tương thích Chat Completions
									</span>
									<span className="flex items-center gap-1.5">
										<svg
											className="size-4 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										Cần cấu hình quyền truy cập upstream
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="animate-hero-enter hero-enter-delay-3">
						<div className="mx-auto mt-8 max-w-7xl px-4 pb-16 sm:mt-12 sm:px-6 md:mt-20 md:pb-24">
							<DashboardDemo />
							<dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
								{STATS.map((stat) => (
									<div
										key={stat.label}
										className="flex flex-col-reverse bg-background px-5 py-4"
									>
										<dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
											{stat.label}
										</dt>
										<dd className="font-display text-2xl font-bold tracking-tight md:text-3xl">
											{stat.value}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
