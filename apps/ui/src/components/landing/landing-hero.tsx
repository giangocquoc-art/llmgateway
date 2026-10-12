import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { ShimmerButton } from "@/lib/components/shimmer-button";

const STATS = [
	{ value: "Anthropic", label: "API Messages" },
	{ value: "OpenAI", label: "Tương thích Chat Completions" },
	{ value: "Streaming", label: "Responses" },
	{ value: "Upstream", label: "Có thể cấu hình tuyến dự phòng" },
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
			<section className="bg-[#f6f4ee] text-[#101c3a]">
				{/* pt-36 (not pt-24) on mobile clears the Runware promo banner
						    stacked above the fixed navbar; revert when the promo ends. */}
				<div className="relative pt-36">
					<div
						aria-hidden
						className="absolute inset-0 -z-10 size-full bg-[#f6f4ee]"
					/>
					<div className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-14">
						<div className="relative z-10">
							{/* Announcement badge - centered */}
							<div className="mb-8 flex justify-center lg:mb-10 lg:justify-start">
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
							<div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
								<div>
									<h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
										PShareHub AI Gateway
									</h1>
									<p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-8 text-[#586580] md:mt-6 md:text-lg lg:mx-0">
										Cổng API AI thống nhất của PShareHub, hỗ trợ Anthropic
										Messages và OpenAI Chat Completions. Bảng quản trị dành
										riêng cho chủ dự án; kết nối mô hình sẽ khả dụng sau khi cấu
										hình nhà cung cấp.
									</p>
								</div>

								{/* Primary CTA - Maximum prominence */}
								<div className="animate-hero-enter hero-enter-delay-1 mt-8 flex flex-col items-center gap-6 md:mt-10 lg:items-start">
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
													<span>Mở bảng quản trị</span>
													<ArrowRight className="size-6 md:size-7 transition-transform group-hover:translate-x-1" />
												</span>
											</ShimmerButton>
										</a>
									</div>

									{/* Trust indicators */}
									<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#586580] lg:justify-start">
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
						<div className="relative mx-auto flex w-full max-w-[540px] items-center justify-center lg:mx-0 lg:min-h-[500px]">
							<div
								aria-hidden="true"
								className="absolute size-[min(80vw,440px)] rounded-full bg-[#e9e2ff]"
							/>
							<div
								aria-hidden="true"
								className="absolute right-[8%] top-[14%] size-20 rotate-12 rounded-3xl border border-white/80 bg-white/75 shadow-lg shadow-[#101c3a]/5"
							/>
							<Image
								src="/favicon/chui-web-v21.webp"
								alt="Chúi, linh vật PShareHub"
								width={900}
								height={900}
								priority
								className="relative z-10 h-auto w-[min(88vw,480px)] object-contain drop-shadow-[0_24px_28px_rgba(16,28,58,0.12)]"
							/>
						</div>
					</div>

					<div className="animate-hero-enter hero-enter-delay-3">
						<div className="mx-auto mt-8 max-w-7xl px-4 pb-16 sm:mt-12 sm:px-6 md:mt-20 md:pb-24">
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
