import { DeveloperRouteGuard } from "@/components/dashboard/developer-route-guard";
import { LastUsedProjectTracker } from "@/components/dashboard/last-used-project-tracker";

import type { ReactNode } from "react";

interface ProjectLayoutProps {
	children: ReactNode;
	params: Promise<{ orgId: string; projectId: string }>;
}

export default async function ProjectLayout({
	children,
	params,
}: ProjectLayoutProps) {
	const { orgId, projectId } = await params;

	return (
		<>
			<DeveloperRouteGuard />
			<LastUsedProjectTracker orgId={orgId} projectId={projectId} />
			{children}
		</>
	);
}
