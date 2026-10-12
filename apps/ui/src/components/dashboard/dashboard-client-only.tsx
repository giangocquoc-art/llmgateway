"use client";

import dynamic from "next/dynamic";

import type { DashboardClientProps } from "./dashboard-client";

const Dashboard = dynamic(
	() => import("./dashboard-client").then((module) => module.DashboardClient),
	{
		ssr: false,
		loading: () => (
			<div className="min-h-96 animate-pulse rounded-lg bg-muted" />
		),
	},
);

export function DashboardClientOnly(props: DashboardClientProps) {
	return <Dashboard {...props} />;
}
