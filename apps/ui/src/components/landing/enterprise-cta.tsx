"use client";

import { ArrowUpRight, Terminal } from "lucide-react";

const ZALO_URL = "https://zalo.me/0583799593";

export function EnterpriseCTA() {
	return (
		<section className="relative overflow-hidden border-y border-[#d9d8d1] bg-[#f6f4ee] py-20 md:py-28">
			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-5xl">
					<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6045e8]">
						CÔNG CỤ DÀNH CHO NHÀ PHÁT TRIỂN
					</p>
					<h2 className="font-display text-3xl font-bold tracking-tight text-[#151c38] md:text-5xl">
						Bắt đầu cùng{" "}
						<span className="text-[#6045e8]">CLI bạn yêu thích.</span>
					</h2>
					<p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6680]">
						PShareHub hỗ trợ Codex CLI và Claude CLI. Nhắn cho tụi mình để được
						tư vấn cách bắt đầu.
					</p>

					<div className="mt-10 grid gap-4 sm:grid-cols-2">
						<div className="flex items-center gap-4 rounded-xl border border-[#d9d8d1] bg-white p-5">
							<span className="flex size-11 items-center justify-center rounded-lg bg-[#e8e2ff] text-[#6045e8]">
								<Terminal className="size-5" aria-hidden="true" />
							</span>
							<div>
								<h3 className="font-semibold text-[#151c38]">Codex CLI</h3>
								<p className="text-sm text-[#5d6680]">
									Được hỗ trợ tại PShareHub
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4 rounded-xl border border-[#d9d8d1] bg-white p-5">
							<span className="flex size-11 items-center justify-center rounded-lg bg-[#d9eee0] text-[#245b50]">
								<Terminal className="size-5" aria-hidden="true" />
							</span>
							<div>
								<h3 className="font-semibold text-[#151c38]">Claude CLI</h3>
								<p className="text-sm text-[#5d6680]">
									Được hỗ trợ tại PShareHub
								</p>
							</div>
						</div>
					</div>

					<a
						href={ZALO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-8 inline-flex items-center gap-2 font-semibold text-[#6045e8] hover:text-[#5036d7]"
					>
						Liên hệ để được tư vấn{" "}
						<ArrowUpRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>
	);
}
