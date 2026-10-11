import Image from "next/image";

export function PShareHubLogo({
	compact = false,
	className,
}: {
	compact?: boolean;
	className?: string;
}) {
	if (compact) {
		return (
			<Image
				src="/favicon/chui-brand-mark.svg"
				alt="Chúi, linh vật PShareHub"
				width={30}
				height={30}
				className={className}
			/>
		);
	}

	return (
		<span className="inline-flex items-center gap-2.5">
			<Image
				src="/favicon/chui-brand-mark.svg"
				alt=""
				aria-hidden="true"
				width={34}
				height={34}
				priority
				className="size-[34px] shrink-0 rounded-full"
			/>
			<span className="flex flex-col gap-0.5 leading-none">
				<span className="font-display text-[20px] font-extrabold tracking-[-0.06em] text-foreground">
					PShare<span className="text-primary">Hub</span>
				</span>
				<span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
					AI Gateway
				</span>
			</span>
		</span>
	);
}
