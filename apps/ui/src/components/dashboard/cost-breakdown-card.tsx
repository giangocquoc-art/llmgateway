"use client";

import { CostBreakdownChart } from "@/components/usage/cost-breakdown-chart";
import { useLanguage } from "@/lib/language";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/card";

import type { ActivitT } from "@/types/activity";

interface CostBreakdownCardProps {
	initialActivityData?: ActivitT;
}

export function CostBreakdownCard({
	initialActivityData,
}: CostBreakdownCardProps) {
	const { t } = useLanguage();
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("dashboard.costBreakdown", "Chi phí theo nhà cung cấp")}
				</CardTitle>
				<CardDescription>
					{t(
						"dashboard.costBreakdownDescription",
						"Chi phí ước tính theo nhà cung cấp và lưu trữ của dự án",
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<CostBreakdownChart initialData={initialActivityData} />
			</CardContent>
		</Card>
	);
}
