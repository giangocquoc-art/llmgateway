"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { PShareHubLogo } from "@/components/branding/psharehub-logo";
import { Button } from "@/lib/components/button";
import { cn } from "@/lib/utils";

export const Navbar = ({
	children,
	sticky = true,
}: {
	children?: React.ReactNode;
	sticky?: boolean;
}) => {
	const posthog = usePostHog();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 50);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const track = (link: string) =>
		posthog.capture("nav_link_clicked", { link, area: "navbar" });

	return (
		<header>
			<nav
				data-state={menuOpen ? "active" : undefined}
				className={cn("z-20 w-full px-2", sticky && "fixed")}
			>
				<div
					className={cn(
						"mx-auto mt-2 max-w-[1400px] px-6 transition-all duration-300",
						isScrolled &&
							"rounded-2xl border bg-background/90 backdrop-blur-lg lg:px-5",
					)}
				>
					<div className="flex items-center justify-between gap-4 py-3 nav:py-4">
						<Link href="/" className="flex shrink-0 items-center" prefetch>
							<PShareHubLogo />
						</Link>
						<div className="hidden items-center gap-2 nav:flex">
							<a
								href="https://api.psharehub.com/docs/"
								className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
								onClick={() => track("Tài liệu API")}
							>
								Tài liệu API
							</a>
							<a
								href="https://psharehub.com/"
								className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
								onClick={() => track("PShareHub")}
							>
								PShareHub <ArrowUpRight className="ml-1 inline size-3.5" />
							</a>
						</div>
						<div className="hidden items-center gap-3 nav:flex">
							<Button asChild>
								<a
									href="https://api.psharehub.com/admin/studio/"
									onClick={() => track("Bảng quản trị")}
								>
									Bảng quản trị
								</a>
							</Button>
						</div>
						<button
							type="button"
							aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen(!menuOpen)}
							className="rounded-md p-2 nav:hidden"
						>
							{menuOpen ? (
								<X className="size-5" />
							) : (
								<Menu className="size-5" />
							)}
						</button>
					</div>
					{menuOpen && (
						<div className="grid gap-2 border-t py-4 nav:hidden">
							<a
								className="rounded-lg px-3 py-2"
								href="https://api.psharehub.com/docs/"
							>
								Tài liệu API
							</a>
							<a className="rounded-lg px-3 py-2" href="https://psharehub.com/">
								Trang chủ PShareHub
							</a>
							<a
								className="rounded-lg px-3 py-2"
								href="https://api.psharehub.com/admin/studio/"
							>
								Bảng quản trị
							</a>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};
