const capabilities = [
	"Anthropic Messages",
	"OpenAI Chat Completions",
	"Phản hồi streaming",
	"Có thể cấu hình tuyến dự phòng",
];

export function TrustBarEnterprise() {
	return (
		<section className="border-y border-border bg-muted/30 py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="mb-8 text-center text-sm font-normal uppercase tracking-wider text-muted-foreground">
					Năng lực của PShareHub AI Gateway
				</h2>
				<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
					{capabilities.map((capability) => (
						<div
							key={capability}
							className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
						>
							{capability}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
