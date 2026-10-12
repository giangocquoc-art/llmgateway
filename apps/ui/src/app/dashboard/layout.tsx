import { redirect } from "next/navigation";

import { getUser } from "@/lib/getUser";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
	},
};

interface DashboardLayoutProps {
	children: ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	// Cloudflare Access protects the hosted dashboard and authenticates the
	// linked API requests. Avoid a duplicate server-side API round-trip here:
	// this layout only wraps a client-rendered dashboard, and the Worker Free
	// CPU budget is too small for that extra fetch on each route transition.
	if (process.env.HOSTED === "true") return children;

	if (!(await getUser())) return redirect("/login");
	return children;
}
