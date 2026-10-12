import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/lib/components/button";

export function QuickStartSection() {
	return (
		<div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6045e8]">
					<Image
						src="/favicon/chui-brand-mark.svg"
						alt=""
						aria-hidden="true"
						width={20}
						height={20}
					/>
					<span>Hạn mức VietAPI</span>
				</div>
				<h3 className="font-display text-xl font-semibold tracking-tight text-[#151c38]">
					Kiểm tra token còn lại
				</h3>
				<p className="max-w-2xl text-sm leading-6 text-[#5d6680]">
					Xem token/ngày còn lại, lượt gọi theo model và nhật ký sử dụng trong
					dashboard VietAPI. PShareHub chưa đồng bộ số liệu quota tự động.
				</p>
				<p className="text-sm text-[#5d6680]">
					Key VietAPI được cấp hoặc thu hồi thủ công tại dashboard nhà cung cấp.
				</p>
			</div>
			<Button
				asChild
				className="w-full bg-[#6045e8] text-white hover:bg-[#5036d7] sm:w-auto"
			>
				<a
					href="https://vietapi.tech/dashboard.html"
					target="_blank"
					rel="noopener noreferrer"
				>
					Mở Dashboard VietAPI
					<ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
				</a>
			</Button>
		</div>
	);
}
