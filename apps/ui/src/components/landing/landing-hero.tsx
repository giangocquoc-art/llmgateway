import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { ShimmerButton } from "@/lib/components/shimmer-button";

const ZALO_URL = "https://zalo.me/0583799593";

export function LandingHero() {
	return (
		<div className="overflow-hidden">
			<section className="bg-white text-[#101c3a]">
				<div className="relative pt-36">
					<div
						aria-hidden
						className="absolute inset-0 -z-10 size-full bg-white"
					/>
					<div className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-14">
						<div className="relative z-10">
							<div className="mb-8 flex justify-center lg:mb-10 lg:justify-start">
								<div className="animate-hero-enter flex items-center gap-2 rounded-full border border-border/80 bg-background/75 px-4 py-2 shadow-sm shadow-[#101c3a]/5">
									<Image
										src="/favicon/chui-brand-mark.svg"
										alt=""
										aria-hidden
										width={22}
										height={22}
									/>
									<span className="text-sm font-medium text-foreground">
										PShareHub · AI CLI
									</span>
								</div>
							</div>

							<div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
								<p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6045e8]">
									Chia sẻ tri thức · Kiến tạo giá trị
								</p>
								<h1 className="text-balance font-display text-4xl font-bold tracking-tight text-[#101c3a] md:text-5xl lg:text-6xl">
									Codex CLI & Claude CLI, sẵn sàng đồng hành.
								</h1>
								<p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-8 text-[#586580] md:mt-6 md:text-lg lg:mx-0">
									PShareHub hỗ trợ Codex CLI và Claude CLI. Liên hệ để được tư
									vấn và hướng dẫn phù hợp với nhu cầu của bạn.
								</p>
								<div className="mt-8 flex flex-col items-center gap-5 md:mt-10 lg:items-start">
									<a
										href={ZALO_URL}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative w-full sm:w-auto"
									>
										<div
											aria-hidden
											className="absolute -inset-3 rounded-full bg-[#ffad4e]/30 blur-xl"
										/>
										<ShimmerButton
											background="#6045e8"
											className="relative w-full px-8 py-4 shadow-2xl shadow-[#6045e8]/25 sm:w-auto md:px-10"
										>
											<span className="flex items-center justify-center gap-3 text-center text-lg font-bold text-white md:text-xl">
												Liên hệ ngay để được tư vấn
												<ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
											</span>
										</ShimmerButton>
									</a>
									<a
										href={ZALO_URL}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-sm text-[#586580] underline decoration-[#d9d8d1] underline-offset-4 hover:text-[#6045e8]"
									>
										Zalo 0583 799 593{" "}
										<ArrowUpRight className="size-4" aria-hidden="true" />
									</a>
								</div>
							</div>
						</div>

						<div className="relative mx-auto flex w-full max-w-[540px] items-center justify-center lg:mx-0 lg:min-h-[500px]">
							<div
								aria-hidden="true"
								className="absolute size-[min(80vw,440px)] rounded-full bg-[#e8e2ff]"
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

					<div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-[#e8e2ff] bg-[#f7f5ff] px-6 py-5 text-center font-display text-xl font-semibold text-[#6045e8]">
								Codex CLI
							</div>
							<div className="rounded-2xl border border-[#d9eee0] bg-[#f4fbf6] px-6 py-5 text-center font-display text-xl font-semibold text-[#245b50]">
								Claude CLI
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
