"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { useApi } from "@/lib/fetch-client";

import type { Route } from "next";

const LAST_PROJECT_KEY = "llmgateway-last-used-project";

export function DashboardEntryRedirect() {
	const router = useRouter();
	const api = useApi();
	useUser({ redirectTo: "/login", redirectWhen: "unauthenticated" });

	const { data: orgsData } = api.useQuery("get", "/orgs", {}, { retry: 0 });
	const organization = orgsData?.organizations?.[0];
	const { data: projectsData } = api.useQuery(
		"get",
		"/orgs/{id}/projects",
		{ params: { path: { id: organization?.id ?? "" } } },
		{ enabled: !!organization?.id, retry: 0 },
	);

	useEffect(() => {
		if (!orgsData) {
			return;
		}
		if (!organization) {
			router.replace("/onboarding");
			return;
		}
		if (!projectsData) {
			return;
		}

		const projects = projectsData.projects ?? [];
		if (projects.length === 0) {
			router.replace(`/dashboard/${organization.id}` as Route);
			return;
		}

		const lastProjectId = window.localStorage.getItem(
			`${LAST_PROJECT_KEY}-${organization.id}`,
		);
		const project =
			projects.find((item) => item.id === lastProjectId) ?? projects[0];
		router.replace(`/dashboard/${organization.id}/${project.id}` as Route);
	}, [orgsData, organization, projectsData, router]);

	return <div className="min-h-screen animate-pulse bg-background" />;
}
