import { PShareHubWorkerConfig } from "@/components/dashboard/psharehub-worker-config";

import { RoutingConfigClient } from "./_components/routing-config-client";

export default async function RoutingPage({
	params,
}: {
	params: Promise<{ orgId: string; projectId: string }>;
}) {
	if (process.env.NEXT_PUBLIC_PSHAREHUB_SINGLE_OWNER === "true") {
		return <PShareHubWorkerConfig mode="routing" />;
	}

	const { orgId, projectId } = await params;
	return <RoutingConfigClient orgId={orgId} projectId={projectId} />;
}
