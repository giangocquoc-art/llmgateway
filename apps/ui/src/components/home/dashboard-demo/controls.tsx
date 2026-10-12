"use client";

import {
	endOfMonth,
	endOfQuarter,
	endOfWeek,
	endOfYear,
	format,
	getQuarter,
	parseISO,
	startOfMonth,
	startOfQuarter,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subQuarters,
	subWeeks,
	subYears,
} from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { DayRangePicker } from "@/components/date-range-picker";
import { TrackedLink } from "@/components/home/tracked-link";
import { Input } from "@/lib/components/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/lib/components/popover";
import { useLanguage } from "@/lib/language";
import { USAGE_MODE_OPTIONS, type UsageMode } from "@/lib/usage-mode";
import { cn } from "@/lib/utils";

import type { UsageDateRange } from "@/components/dashboard/usage-comparison";

interface DatePreset {
	label: string;
	value: string;
	getRange: () => UsageDateRange;
}

function quarterLabel(date: Date): string {
	return `Q${getQuarter(date)} ${format(date, "yyyy")}`;
}

function localizedPresetLabel(
	preset: DatePreset,
	t: (key: string, fallback?: string) => string,
): string {
	const simpleKeys: Record<string, [string, string]> = {
		custom: ["date.custom", "Custom"],
		today: ["date.today", "Today"],
		this_week: ["date.thisWeek", "This week"],
		this_month: ["date.thisMonth", "This month"],
		this_year: ["date.thisYear", "This year"],
		last_week: ["date.lastWeek", "Last week"],
		last_month: ["date.lastMonth", "Last month"],
		last_year: ["date.lastYear", "Last year"],
		last_30_days: ["date.last30Days", "Last 30 days"],
		last_90_days: ["date.last90Days", "Last 90 days"],
		last_6_months: ["date.last6Months", "Last 6 months"],
		all_time: ["date.allTime", "All time"],
	};
	const entry = simpleKeys[preset.value];
	if (entry) {
		return t(entry[0], entry[1]);
	}
	const quarterKeys: Record<string, [string, string]> = {
		this_quarter: ["date.thisQuarter", "This quarter"],
		last_quarter: ["date.lastQuarter", "Last quarter"],
		"2_quarters_ago": ["date.twoQuartersAgo", "2 quarters ago"],
		"3_quarters_ago": ["date.threeQuartersAgo", "3 quarters ago"],
	};
	const quarterEntry = quarterKeys[preset.value];
	const quarter = preset.label.match(/\((Q\d+ \d{4})\)/)?.[1];
	return quarterEntry
		? `${t(quarterEntry[0], quarterEntry[1])}${quarter ? ` (${quarter})` : ""}`
		: preset.label;
}

function buildPresets(anchorDay: string): DatePreset[] {
	const today = parseISO(anchorDay);
	return [
		{
			label: "Custom",
			value: "custom",
			getRange: () => ({ from: subDays(today, 6), to: today }),
		},
		{
			label: "Today",
			value: "today",
			getRange: () => ({ from: today, to: today }),
		},
		{
			label: "This week",
			value: "this_week",
			getRange: () => ({
				from: startOfWeek(today, { weekStartsOn: 1 }),
				to: today,
			}),
		},
		{
			label: "This month",
			value: "this_month",
			getRange: () => ({ from: startOfMonth(today), to: today }),
		},
		{
			label: "This year",
			value: "this_year",
			getRange: () => ({ from: startOfYear(today), to: today }),
		},
		{
			label: "Last week",
			value: "last_week",
			getRange: () => {
				const lastWeek = subWeeks(today, 1);
				return {
					from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
					to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
				};
			},
		},
		{
			label: "Last month",
			value: "last_month",
			getRange: () => {
				const lastMonth = subMonths(today, 1);
				return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
			},
		},
		{
			label: "Last year",
			value: "last_year",
			getRange: () => {
				const lastYear = subYears(today, 1);
				return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
			},
		},
		{
			label: "Last 30 days",
			value: "last_30_days",
			getRange: () => ({ from: subDays(today, 29), to: today }),
		},
		{
			label: "Last 90 days",
			value: "last_90_days",
			getRange: () => ({ from: subDays(today, 89), to: today }),
		},
		{
			label: "Last 6 months",
			value: "last_6_months",
			getRange: () => ({ from: subMonths(today, 6), to: today }),
		},
		{
			label: `This quarter (${quarterLabel(today)})`,
			value: "this_quarter",
			getRange: () => ({ from: startOfQuarter(today), to: today }),
		},
		{
			label: `Last quarter (${quarterLabel(subQuarters(today, 1))})`,
			value: "last_quarter",
			getRange: () => {
				const quarter = subQuarters(today, 1);
				return { from: startOfQuarter(quarter), to: endOfQuarter(quarter) };
			},
		},
		{
			label: `2 quarters ago (${quarterLabel(subQuarters(today, 2))})`,
			value: "2_quarters_ago",
			getRange: () => {
				const quarter = subQuarters(today, 2);
				return { from: startOfQuarter(quarter), to: endOfQuarter(quarter) };
			},
		},
		{
			label: `3 quarters ago (${quarterLabel(subQuarters(today, 3))})`,
			value: "3_quarters_ago",
			getRange: () => {
				const quarter = subQuarters(today, 3);
				return { from: startOfQuarter(quarter), to: endOfQuarter(quarter) };
			},
		},
		{
			label: "All time",
			value: "all_time",
			getRange: () => ({ from: new Date(2020, 0, 1), to: today }),
		},
	];
}

function findMatchingPreset(
	from: Date,
	to: Date,
	presets: DatePreset[],
): string {
	for (const preset of presets) {
		if (preset.value === "custom") {
			continue;
		}
		const range = preset.getRange();
		if (
			format(from, "yyyy-MM-dd") === format(range.from, "yyyy-MM-dd") &&
			format(to, "yyyy-MM-dd") === format(range.to, "yyyy-MM-dd")
		) {
			return preset.value;
		}
	}
	return "custom";
}

export function defaultDateRange(anchorDay: string): UsageDateRange {
	const today = parseISO(anchorDay);
	return { from: subDays(today, 6), to: today };
}

export function DateRangeControl({
	anchorDay,
	range,
	onChange,
}: {
	anchorDay: string;
	range: UsageDateRange;
	onChange: (range: UsageDateRange, label: string) => void;
}) {
	const { language, t } = useLanguage();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [showCalendar, setShowCalendar] = useState(false);
	const presets = buildPresets(anchorDay);
	const activePreset = findMatchingPreset(range.from, range.to, presets);
	const preset = presets.find((item) => item.value === activePreset);
	const triggerLabel =
		preset && preset.value !== "custom"
			? localizedPresetLabel(preset, t)
			: `${format(range.from, language === "vi" ? "d MMM yyyy" : "MMM d, yyyy", { locale: language === "vi" ? vi : undefined })} – ${format(range.to, language === "vi" ? "d MMM yyyy" : "MMM d, yyyy", { locale: language === "vi" ? vi : undefined })}`;
	const filteredPresets = search.trim()
		? presets.filter((item) =>
				localizedPresetLabel(item, t)
					.toLowerCase()
					.includes(search.toLowerCase()),
			)
		: presets;

	return (
		<Popover
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					setSearch("");
					setShowCalendar(false);
				}
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="border-input hover:bg-accent hover:text-accent-foreground flex h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
				>
					{triggerLabel}
					<ChevronDownIcon className="h-4 w-4 opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"p-0",
					showCalendar
						? "max-h-[var(--radix-popover-content-available-height)] w-[calc(100vw-2rem)] overflow-y-auto p-3 sm:w-auto"
						: "w-72",
				)}
				align="start"
			>
				{!showCalendar ? (
					<div>
						<div className="px-3 pb-2 pt-3">
							<Input
								autoFocus
								placeholder={t(
									"dashboard.searchDateRanges",
									"Search date ranges...",
								)}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="h-8 rounded-none border-0 border-b-2 border-primary bg-transparent px-0 shadow-none focus-visible:ring-0"
							/>
						</div>
						<div className="max-h-72 overflow-y-auto pb-1">
							{filteredPresets.map((item) => (
								<button
									key={item.value}
									type="button"
									onClick={() => {
										if (item.value === "custom") {
											setShowCalendar(true);
											return;
										}
										onChange(item.getRange(), item.label);
										setOpen(false);
									}}
									className={cn(
										"w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
										activePreset === item.value && "bg-accent/50",
									)}
								>
									{localizedPresetLabel(item, t)}
								</button>
							))}
						</div>
					</div>
				) : (
					<DayRangePicker
						from={range.from}
						to={range.to}
						onCancel={() => setShowCalendar(false)}
						onSelect={(from, to) => {
							onChange({ from, to }, "Custom");
							setOpen(false);
							setShowCalendar(false);
						}}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}

export function UsageModeControl({
	mode,
	onChange,
	className,
}: {
	mode: UsageMode;
	onChange: (mode: UsageMode) => void;
	className?: string;
}) {
	const { t } = useLanguage();
	const labels: Record<UsageMode, string> = {
		total: t("demo.allTraffic", "All"),
		credits: t("demo.creditsMode", "Credits"),
		"api-keys": t("demo.byokMode", "BYOK"),
	};
	return (
		<div
			className={cn(
				"inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5",
				className,
			)}
		>
			{USAGE_MODE_OPTIONS.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					title={
						option.value === "api-keys"
							? t(
									"demo.byokDescription",
									"Usage served by your own provider keys (not billed to credits)",
								)
							: option.value === "credits"
								? t(
										"demo.creditsDescription",
										"Usage billed against your credit balance",
									)
								: t("demo.allTrafficDescription", "All traffic")
					}
					className={cn(
						"rounded-md px-3 py-1 text-xs font-medium transition-colors",
						mode === option.value
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{labels[option.value]}
				</button>
			))}
		</div>
	);
}

export type TimeRangeValue = "1h" | "4h" | "24h" | "7d" | "30d";

const TIME_RANGES: TimeRangeValue[] = ["1h", "4h", "24h", "7d", "30d"];

export function TimeRangeControl({
	value,
	onChange,
}: {
	value: TimeRangeValue;
	onChange: (value: TimeRangeValue) => void;
}) {
	return (
		<div className="flex w-full items-center rounded-md border bg-muted p-0.5 sm:inline-flex sm:w-auto">
			{TIME_RANGES.map((range) => (
				<button
					key={range}
					type="button"
					onClick={() => onChange(range)}
					className={cn(
						"flex-1 rounded-sm px-3 py-1 text-sm font-medium transition-colors sm:flex-none",
						value === range
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{range}
				</button>
			))}
		</div>
	);
}

export function EnterpriseBanner({
	view,
	message = "Enterprise feature, shown with sample data.",
}: {
	view: string;
	message?: string;
}) {
	const slug = view.replace(/^org\//, "").replace(/[^a-z0-9]+/g, "_");
	return (
		<div className="flex shrink-0 items-center gap-3 border-b border-blue-500/25 bg-blue-500/[0.07] px-4 py-2.5 text-sm text-blue-900 dark:text-blue-100">
			<span
				aria-hidden
				className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
			/>
			<p className="min-w-0 flex-1 font-medium">{message}</p>
			<TrackedLink
				href="/enterprise#contact"
				location="home_demo"
				cta={`book_demo_${slug}`}
				className="shrink-0 font-medium underline underline-offset-4"
			>
				Book a demo
			</TrackedLink>
		</div>
	);
}
