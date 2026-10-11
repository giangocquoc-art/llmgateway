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
			<>
				<Image
					src="/brand/logo-black.svg"
					alt="PShareHub"
					width={28}
					height={30}
					className={`dark:hidden ${className ?? ""}`}
				/>
				<Image
					src="/brand/logo-white.svg"
					alt=""
					aria-hidden="true"
					width={28}
					height={30}
					className={`hidden dark:block ${className ?? ""}`}
				/>
			</>
		);
	}

	return (
		<span className="inline-flex flex-col items-start gap-0.5">
			<Image
				src="/brand/logo-with-name-black.svg"
				alt="PShareHub"
				width={148}
				height={23}
				priority
				className={`h-auto w-[148px] dark:hidden ${className ?? ""}`}
			/>
			<Image
				src="/brand/logo-with-name-white.svg"
				alt=""
				aria-hidden="true"
				width={148}
				height={23}
				className={`hidden h-auto w-[148px] dark:block ${className ?? ""}`}
			/>
			<span className="pl-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
				AI Gateway
			</span>
		</span>
	);
}
