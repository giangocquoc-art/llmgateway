import Link from "next/link";

const footerLinks = [
	{ href: "https://psharehub.com/", label: "Trang chủ PShareHub" },
	{
		href: "https://api.psharehub.com/admin/studio/",
		label: "Bảng điều khiển API",
	},
	{
		href: "https://github.com/giangocquoc-art/llmgateway/tree/cf-ui-release",
		label: "Mã nguồn",
	},
];

export default function Footer() {
	return (
		<footer className="relative bg-background py-10">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<div className="container mx-auto flex flex-col gap-8 px-4">
				<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
					<div>
						<a
							href="https://psharehub.com/"
							className="font-display text-lg font-bold text-foreground hover:text-primary"
						>
							PShareHub AI Gateway
						</a>
						<p className="mt-2 max-w-md text-sm text-muted-foreground">
							Cổng API AI của PShareHub. Nhà cung cấp upstream chưa được kết
							nối; yêu cầu AI hiện chưa được xử lý.
						</p>
					</div>
					<nav aria-label="Liên kết cuối trang">
						<ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
							{footerLinks.map((link) => (
								<li key={link.href}>
									{link.href.startsWith("http") ? (
										<a
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="underline-offset-4 hover:text-foreground hover:underline"
										>
											{link.label}
										</a>
									) : (
										<Link
											href={link.href}
											className="underline-offset-4 hover:text-foreground hover:underline"
										>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</nav>
				</div>
				<div className="flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
					<p>
						&copy; {new Date().getFullYear()} PShareHub AI Gateway. Giao diện
						dựa trên LLM Gateway, giấy phép AGPLv3.
					</p>
					<a
						href="https://www.gnu.org/licenses/agpl-3.0.html"
						target="_blank"
						rel="noreferrer"
						className="underline-offset-4 hover:text-foreground hover:underline"
					>
						Thông tin giấy phép
					</a>
				</div>
			</div>
		</footer>
	);
}
