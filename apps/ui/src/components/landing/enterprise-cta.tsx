"use client";

import { ArrowRight, Building2, Lock, Server, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/lib/components/button";

import { AnimatedGroup } from "./animated-group";

const capabilities = [
	{
		icon: Lock,
		title: "Anthropic Messages",
		description: "API tương thích với định dạng Anthropic Messages.",
	},
	{
		icon: Server,
		title: "OpenAI Chat Completions",
		description: "Tương thích với định dạng OpenAI Chat Completions.",
	},
	{
		icon: Zap,
		title: "Phản hồi theo luồng",
		description: "Hỗ trợ truyền phản hồi theo luồng.",
	},
	{
		icon: Building2,
		title: "Tuyến dự phòng",
		description: "Chuyển sang tuyến khác khi tuyến chính gặp sự cố.",
	},
];

export function EnterpriseCTA() {
	return (
		<section className="relative py-24 md:py-32 overflow-hidden">
			{/* Subtle top separator */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

			{/* Background treatment - dark panel effect */}
			<div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.03] via-foreground/[0.05] to-foreground/[0.03]" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-blue-500)/0.08,transparent)]" />

			<div className="container relative mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<AnimatedGroup preset="blur-slide" className="text-center mb-16">
						<h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
							Cổng API AI
							<br />
							kết nối mô hình AI
						</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
							Kết nối tài khoản nhà cung cấp trong bảng quản trị để chuyển tiếp
							yêu cầu qua một giao diện API thống nhất.
						</p>
					</AnimatedGroup>

					{/* Capability cards */}
					<AnimatedGroup
						preset="slide"
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
					>
						{capabilities.map((cap) => (
							<div
								key={cap.title}
								className="group rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5"
							>
								<div className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center mb-4 transition-colors group-hover:border-blue-500/30 group-hover:bg-blue-500/5">
									<cap.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-blue-500" />
								</div>
								<h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
									{cap.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{cap.description}
								</p>
							</div>
						))}
					</AnimatedGroup>

					{/* CTA row */}
					<AnimatedGroup
						preset="blur-slide"
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
					>
						<Button
							size="lg"
							className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium w-full sm:w-auto"
							asChild
						>
							<Link href="https://github.com/giangocquoc-art/llmgateway/tree/cf-ui-release">
								Xem mã nguồn
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-border bg-transparent text-foreground hover:bg-muted px-8 py-6 text-base w-full sm:w-auto"
							asChild
						>
							<Link href="https://psharehub.com/">Truy cập PShareHub</Link>
						</Button>
					</AnimatedGroup>

					{/* Trust line */}
					<AnimatedGroup
						preset="fade"
						className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
					>
						<span>Một địa chỉ API</span>
						<span className="h-3 w-px bg-border" />
						<span>Điều hướng yêu cầu</span>
						<span className="h-3 w-px bg-border" />
						<span>Mã nguồn mở (AGPLv3)</span>
						<span className="h-3 w-px bg-border hidden sm:block" />
						<span className="hidden sm:inline">
							Cần kết nối nhà cung cấp AI
						</span>
					</AnimatedGroup>
				</div>
			</div>
		</section>
	);
}
