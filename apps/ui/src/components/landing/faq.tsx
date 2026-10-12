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
		question: "PShareHub AI Gateway là gì?",
		answer:
			"PShareHub AI Gateway chuyển tiếp yêu cầu AI qua một giao diện API thống nhất. Bảng quản trị được bảo vệ bằng Cloudflare Access và dành riêng cho chủ dự án.",
	},
	{
		question: "Gateway hỗ trợ định dạng API nào?",
		answer:
			"Cổng hỗ trợ Anthropic Messages và OpenAI Chat Completions, bao gồm phản hồi theo luồng. Quản trị viên cần kết nối tài khoản nhà cung cấp trước khi gửi yêu cầu đến model.",
	},
	{
		question: "Làm thế nào để truy cập?",
		answer:
			"Bảng quản trị dành riêng cho chủ dự án và được bảo vệ bằng Cloudflare Access. API chưa mở đăng ký công khai; yêu cầu cần API key hợp lệ và tài khoản nhà cung cấp đã kết nối.",
	},
	{
		question: "Chi phí sử dụng là bao nhiêu?",
		answer:
			"PShareHub chưa công bố giá sử dụng Gateway. Tài khoản nhà cung cấp được kết nối có thể tính phí theo biểu giá riêng của họ.",
	},
];

export function Faq() {
	return (
		<section className="py-24 md:py-32">
			<div className="container mx-auto px-4">
				<div className="grid gap-12 lg:grid-cols-5">
					<div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
						<h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
							Câu hỏi thường gặp
						</h2>
						<p className="mt-4 text-muted-foreground">
							Thông tin về định dạng API, cách truy cập và chi phí sử dụng.
						</p>
						<p className="mt-6 text-sm text-muted-foreground">
							Chưa tìm thấy câu trả lời?{" "}
							<a
								href="https://psharehub.com/"
								className="text-foreground underline underline-offset-4"
							>
								Truy cập PShareHub
							</a>
						</p>
					</div>
					<div className="lg:col-span-3">
						<Accordion type="single" collapsible className="w-full">
							{faqData.map((item, index) => (
								<AccordionItem
									key={item.question}
									value={`item-${index + 1}`}
									className="py-5 border-border/50"
								>
									<AccordionPrimitive.Header className="flex">
										<AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left font-display text-lg md:text-xl font-medium leading-7 transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 text-foreground">
											{item.question}
											<PlusIcon
												size={18}
												className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
											/>
										</AccordionPrimitive.Trigger>
									</AccordionPrimitive.Header>
									<AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-base text-muted-foreground leading-relaxed pb-2">
										<div className="border-l-2 border-foreground/10 pl-4">
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
