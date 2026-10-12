"use client";

import { ArrowUpRight } from "lucide-react";

import { ShimmerButton } from "@/lib/components/shimmer-button";

import { AnimatedGroup } from "./animated-group";

const ZALO_URL = "https://zalo.me/0583799593";

export default function CallToAction() {
	return (
		<section className="relative overflow-hidden py-24 md:py-32">
			<div className="absolute inset-0 bg-gradient-to-b from-background via-[#e8e2ff]/30 to-background" />
			<div className="container relative mx-auto px-4">
				<div className="mx-auto max-w-3xl text-center">
					<AnimatedGroup preset="blur-slide" className="space-y-6">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6045e8]">
							PSHAREHUB · CODEX CLI · CLAUDE CLI
						</p>
						<h2 className="font-display text-4xl font-bold tracking-tight text-[#151c38] md:text-5xl lg:text-6xl">
							Bạn cần tư vấn thêm?
						</h2>
						<p className="mx-auto max-w-xl text-lg text-[#5d6680]">
							Liên hệ PShareHub qua Zalo để trao đổi về Codex CLI và Claude CLI.
						</p>
					</AnimatedGroup>
					<AnimatedGroup preset="blur-slide" className="mt-9">
						<a
							href={ZALO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex"
						>
							<ShimmerButton
								background="#6045e8"
								className="px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-[#6045e8]/25"
							>
								Liên hệ ngay để được tư vấn
								<ArrowUpRight className="ml-2 size-5" aria-hidden="true" />
							</ShimmerButton>
						</a>
					</AnimatedGroup>
				</div>
			</div>
		</section>
	);
}
