import { cookies } from "next/headers";

import { ChartStyleProvider } from "@/components/analytics/chart-style";
import { DashboardLayoutClientOnly } from "@/components/dashboard/dashboard-layout-client-only";
import { getAnnouncementEntries } from "@/lib/announcements";
import { SidebarProvider } from "@/lib/components/sidebar";

import type { ReactNode } from "react";

interface OrgLayoutProps {
	children: ReactNode;
	params: Promise<{ orgId: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
	const { orgId } = await params;

	// Recent changelog + blog entries for the notifications bell
	const announcementEntries = await getAnnouncementEntries();

	const cookieStore = await cookies();
	const sidebarDefaultOpen =
		cookieStore.get("sidebar_state")?.value !== "false";

	return (
		<SidebarProvider defaultOpen={sidebarDefaultOpen}>
			<ChartStyleProvider
				initialStyle={
					cookieStore.get("analytics_chart_style")?.value === "bar"
						? "bar"
						: "line"
				}
			>
				<DashboardLayoutClientOnly
					selectedOrgId={orgId}
					announcementEntries={announcementEntries}
				>
					{children}
				</DashboardLayoutClientOnly>
			</ChartStyleProvider>
		</SidebarProvider>
	);
}
