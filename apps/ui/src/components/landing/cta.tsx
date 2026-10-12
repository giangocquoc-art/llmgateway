"use client";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/lib/components/button";
import { ShimmerButton } from "@/lib/components/shimmer-button";

import { AnimatedGroup } from "./animated-group";

export default function CallToAction() {
	const posthog = usePostHog();
	return (
		<section className="relative py-32 md:py-40 overflow-hidden">
			{/* Gradient separator at top */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

			{/* Atmospheric background */}
			<div className="absolute inset-0 bg-gradient-to-b from-background via-foreground/[0.02] to-background" />

			{/* Soft radial glow */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/[0.06] dark:bg-purple-500/[0.06] rounded-full blur-3xl pointer-events-none" />

			<div className="container relative mx-auto px-4">
				<div className="max-w-3xl mx-auto text-center">
					<AnimatedGroup preset="blur-slide" className="space-y-6">
						<h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
							PShareHub AI Gateway
							<br />
							Tương thích Anthropic và OpenAI
						</h2>
						<p className="text-lg text-muted-foreground max-w-xl mx-auto">
							Cổng hỗ trợ Anthropic Messages và OpenAI Chat Completions với phản
							hồi streaming. Bảng quản trị dành riêng cho chủ dự án; API công
							khai và giá dịch vụ chưa được mở.
						</p>
					</AnimatedGroup>

					<AnimatedGroup
						preset="blur-slide"
						className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
					>
						<a
							href="https://github.com/giangocquoc-art/llmgateway/tree/psharehub/branding-vietnamese-workers"
							target="_blank"
							rel="noopener noreferrer"
							className="w-full sm:w-auto"
							onClick={() =>
								posthog.capture("cta_clicked", {
									location: "landing_bottom",
									cta: "view_gateway_source",
								})
							}
						>
							<ShimmerButton
								background="#6045e8"
								className="w-full px-8 py-4 text-base font-medium shadow-2xl shadow-[#6045e8]/25 sm:w-auto"
							>
								Xem mã nguồn gateway
							</ShimmerButton>
						</a>
						<Button
							variant="outline"
							className="border-border bg-transparent text-foreground hover:bg-muted px-8 py-6 text-base w-full sm:w-auto"
							asChild
						>
							<a
								href="https://psharehub.com/"
								target="_blank"
								rel="noopener noreferrer"
								onClick={() =>
									posthog.capture("cta_clicked", {
										location: "landing_bottom",
										cta: "visit_psharehub",
									})
								}
							>
								Truy cập PShareHub
							</a>
						</Button>
					</AnimatedGroup>
				</div>
			</div>
		</section>
	);
}
