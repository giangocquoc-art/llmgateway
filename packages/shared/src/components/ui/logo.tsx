export type LogoProps = React.HTMLAttributes<SVGElement>;

export const Logo = (props: LogoProps) => (
	<svg
		fill="none"
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 128 128"
	>
		<image href="/favicon/chui-brand-mark.svg" width="128" height="128" />
	</svg>
);

export const LogoLockup = (props: LogoProps) => (
	<svg
		role="img"
		aria-label="PShareHub AI Gateway"
		fill="currentColor"
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 330 72"
	>
		<image
			href="/favicon/chui-brand-mark.svg"
			x="0"
			y="4"
			width="64"
			height="64"
		/>
		<text
			x="76"
			y="37"
			fontFamily="Manrope, Arial, sans-serif"
			fontSize="32"
			fontWeight="800"
			letterSpacing="-1.8"
		>
			PShare<tspan fill="#6045e8">Hub</tspan>
		</text>
		<text
			x="78"
			y="57"
			fill="#586580"
			fontFamily="'Be Vietnam Pro', Arial, sans-serif"
			fontSize="10"
			fontWeight="700"
			letterSpacing="2.2"
		>
			AI GATEWAY
		</text>
	</svg>
);
