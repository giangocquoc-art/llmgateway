"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PShareHubLogo } from "@/components/branding/psharehub-logo";
import { Button } from "@/lib/components/button";
import { cn } from "@/lib/utils";

const ZALO_URL = "https://zalo.me/0583799593";

export const Navbar = ({
	children,
	sticky = true,
}: {
	children?: React.ReactNode;
	sticky?: boolean;
}) => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header>
			<nav
				data-state={menuOpen ? "active" : undefined}
				className={cn("z-20 w-full px-2", sticky && "fixed")}
			>
				<div className="mx-auto mt-2 max-w-[1400px] px-6">
					<div className="flex items-center justify-between gap-4 py-3 nav:py-4">
						<Link href="/" className="flex shrink-0 items-center" prefetch>
							<PShareHubLogo />
						</Link>
						<div className="hidden items-center gap-2 nav:flex">
							<a
								href="https://psharehub.com/"
								className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
							>
								PShareHub <ArrowUpRight className="ml-1 inline size-3.5" />
							</a>
						</div>
						<div className="hidden nav:flex">
							<Button
								asChild
								className="bg-[#6045e8] text-white hover:bg-[#5036d7]"
							>
								<a href={ZALO_URL} target="_blank" rel="noopener noreferrer">
									Liên hệ tư vấn
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
							<a className="rounded-lg px-3 py-2" href="https://psharehub.com/">
								Trang chủ PShareHub
							</a>
							<a
								className="rounded-lg bg-[#6045e8] px-3 py-2 text-white"
								href={ZALO_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								Liên hệ ngay qua Zalo
							</a>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};
