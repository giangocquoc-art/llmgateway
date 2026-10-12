import { CircleAlert } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/landing/footer";
import { HeroRSC } from "@/components/landing/hero-rsc";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tính năng nâng cao | PShareHub AI Gateway",
	description:
		"Thông tin về trạng thái hiện tại của PShareHub AI Gateway và các tính năng chưa được bật.",
	robots: { index: false, follow: false },
};

export default function EnterprisePage() {
	return (
		<>
			<HeroRSC />
			<main className="min-h-[60vh] bg-[#f6f4ee] px-6 py-32 text-[#101c3a]">
				<section className="mx-auto max-w-3xl rounded-3xl border border-[#101c3a]/10 bg-white/80 p-8 shadow-sm sm:p-12">
					<div className="flex items-start gap-4">
						<CircleAlert
							className="mt-1 size-6 shrink-0 text-[#6045e8]"
							aria-hidden="true"
						/>
						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6045e8]">
								PShareHub AI Gateway
							</p>
							<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
								Tính năng nâng cao chưa khả dụng
							</h1>
							<p className="mt-5 leading-7 text-[#586580]">
								Các tính năng Enterprise của LLMGateway chưa được cấp phép hoặc
								triển khai cho PShareHub. Gateway hiện dành cho một quản trị
								viên qua Cloudflare Access; nhà cung cấp AI upstream chưa được
								kết nối. Vì vậy, yêu cầu inference và các tính năng Enterprise
								chưa hoạt động.
							</p>
							<Link
								href="/"
								className="mt-8 inline-flex rounded-full bg-[#6045e8] px-6 py-3 font-semibold text-white transition hover:bg-[#5036d8]"
							>
								Về trang chủ PShareHub AI Gateway
							</Link>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
