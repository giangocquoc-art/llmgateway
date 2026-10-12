"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/lib/components/accordion";

const faqData = [
	{
		question: "PShareHub hỗ trợ những công cụ CLI nào?",
		answer:
			"PShareHub hỗ trợ Codex CLI và Claude CLI. Liên hệ qua Zalo để được tư vấn theo nhu cầu sử dụng.",
	},
	{
		question: "Tôi cần tư vấn cài đặt thì liên hệ ở đâu?",
		answer:
			"Nhắn Zalo PShareHub theo số 0583 799 593. Tụi mình sẽ trao đổi và hướng dẫn bạn bắt đầu.",
	},
];

export function Faq() {
	return (
		<section className="py-20 md:py-24">
			<div className="container mx-auto px-4">
				<div className="grid gap-10 lg:grid-cols-5">
					<div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
						<h2 className="font-display text-3xl font-bold tracking-tight text-[#151c38] md:text-4xl">
							Câu hỏi thường gặp
						</h2>
						<p className="mt-4 text-[#5d6680]">
							Thông tin về công cụ CLI được PShareHub hỗ trợ.
						</p>
					</div>
					<div className="lg:col-span-3">
						<Accordion type="single" collapsible className="w-full">
							{faqData.map((item, index) => (
								<AccordionItem
									key={item.question}
									value={`item-${index + 1}`}
									className="border-border/50 py-5"
								>
									<AccordionPrimitive.Header className="flex">
										<AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left font-display text-lg font-medium leading-7 text-[#151c38] outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-xl">
											{item.question}
											<PlusIcon
												size={18}
												className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
											/>
										</AccordionPrimitive.Trigger>
									</AccordionPrimitive.Header>
									<AccordionContent className="overflow-hidden pb-2 text-base leading-relaxed text-[#5d6680]">
										<div className="border-l-2 border-[#6045e8]/20 pl-4">
											{item.answer}
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</section>
	);
}
