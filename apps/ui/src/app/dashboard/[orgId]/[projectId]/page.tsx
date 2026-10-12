import { DashboardClientOnly } from "@/components/dashboard/dashboard-client-only";

export default async function Dashboard({
	params,
}: {
	params: Promise<{ orgId: string; projectId: string }>;
}) {
	await params;
	return <DashboardClientOnly />;
}
