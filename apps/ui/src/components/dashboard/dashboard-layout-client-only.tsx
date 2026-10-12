"use client";

import dynamic from "next/dynamic";

import type { DashboardLayoutClient } from "./dashboard-layout-client";
import type { ComponentProps } from "react";

const DashboardLayout = dynamic(
	() =>
		import("./dashboard-layout-client").then(
			(module) => module.DashboardLayoutClient,
		),
	{
		ssr: false,
		loading: () => <div className="min-h-screen" />,
	},
);

export function DashboardLayoutClientOnly(
	props: ComponentProps<typeof DashboardLayoutClient>,
) {
	return <DashboardLayout {...props} />;
}
