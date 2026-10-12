import { PShareHubWorkerConfig } from "@/components/dashboard/psharehub-worker-config";
import { ProviderKeysClient } from "@/components/provider-keys/provider-keys-client";
import { fetchServerData } from "@/lib/server-api";

import type { paths } from "@/lib/api/v1";

type ProviderKeysData =
	paths["/keys/provider"]["get"]["responses"][200]["content"]["application/json"];

export default async function ProviderKeysPage({
	params,
}: {
	params: Promise<{ orgId: string }>;
}) {
	if (process.env.NEXT_PUBLIC_PSHAREHUB_SINGLE_OWNER === "true") {
		return <PShareHubWorkerConfig mode="provider" />;
	}

	const { orgId } = await params;

	// Server-side data fetching for provider keys
	const initialProviderKeysData = await fetchServerData<ProviderKeysData>(
		"GET",
		"/keys/provider",
		{
			params: {
				query: {
					organizationId: orgId,
				},
			},
		},
	);

	return (
		<ProviderKeysClient
			initialProviderKeysData={initialProviderKeysData ?? undefined}
		/>
	);
}
