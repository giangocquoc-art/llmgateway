import { CircleAlert } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/landing/footer";
import { HeroRSC } from "@/components/landing/hero-rsc";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tài liệu nhà phát triển | PShareHub AI Gateway",
	description:
		"Trạng thái hiện tại của API PShareHub và liên kết tới tài liệu gateway.",
	alternates: { canonical: "https://ai.psharehub.com/developers" },
	openGraph: {
		title: "Tài liệu nhà phát triển | PShareHub AI Gateway",
		description:
			"Trạng thái hiện tại của API PShareHub và liên kết tới tài liệu gateway.",
		type: "website",
		url: "https://ai.psharehub.com/developers",
	},
};

export default function DevelopersPage() {
	return (
		<>
			<HeroRSC />
			<main className="min-h-[60vh] bg-[#f6f4ee] px-6 py-32 text-[#101c3a]">
				<section className="mx-auto max-w-3xl rounded-3xl border border-[#101c3a]/10 bg-white/80 p-8 shadow-sm sm:p-12">
					<p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6045e8]">
						PShareHub AI Gateway
					</p>
					<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
						Tài liệu nhà phát triển
					</h1>
					<div className="mt-6 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
						<CircleAlert
							className="mt-0.5 size-5 shrink-0"
							aria-hidden="true"
						/>
						<p className="leading-7">
							API tại <code>ai.psharehub.com/v1</code> chưa được kích hoạt. Nhà
							cung cấp upstream chưa kết nối, nên hiện chưa thể gửi yêu cầu
							inference. Đừng dùng địa chỉ này cho ứng dụng đang chạy.
						</p>
					</div>
					<p className="mt-6 leading-7 text-[#586580]">
						Tài liệu kỹ thuật của gateway hiện có tại API hostname. Tài liệu này
						mô tả các endpoint đã triển khai; trạng thái chưa kết nối upstream
						vẫn áp dụng.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<a
							href="https://api.psharehub.com/docs/"
							className="rounded-full bg-[#6045e8] px-6 py-3 font-semibold text-white transition hover:bg-[#5036d8]"
						>
							Mở tài liệu API
						</a>
						<Link
							href="/"
							className="rounded-full border border-[#101c3a]/20 px-6 py-3 font-semibold text-[#101c3a] transition hover:bg-[#101c3a]/5"
						>
							Về trang chủ
						</Link>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
