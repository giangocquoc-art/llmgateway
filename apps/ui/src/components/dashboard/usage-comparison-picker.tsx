"use client";

import { vi } from "date-fns/locale";
import { Check, ChevronDown, ChevronLeft, GitCompare } from "lucide-react";
import { useState } from "react";

import { DayRangePicker } from "@/components/date-range-picker";
import { Button } from "@/lib/components/button";
import { Calendar } from "@/lib/components/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/lib/components/popover";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

import {
	formatUsageDateRange,
	namedUsageComparisonRange,
	resolveUsageComparisonRange,
	type UsageComparisonMode,
	type UsageDateRange,
} from "./usage-comparison";

type StartDateMode = Extract<
	UsageComparisonMode,
	"previous-week" | "previous-month"
>;

const OPTIONS: {
	value: Exclude<UsageComparisonMode, "custom">;
	label: string;
	description: string;
	labelKey: string;
	descriptionKey: string;
}[] = [
	{
		value: "off",
		label: "No comparison",
		description: "Show only the selected range",
		labelKey: "comparison.noComparison",
		descriptionKey: "comparison.selectedOnly",
	},
	{
		value: "previous-period",
		label: "Previous period",
		description: "The same number of days immediately before",
		labelKey: "comparison.previousPeriod",
		descriptionKey: "comparison.previousPeriodDescription",
	},
	{
		value: "previous-week",
		label: "Week over week",
		description: "A full week starting on the date you choose",
		labelKey: "comparison.weekOverWeek",
		descriptionKey: "comparison.weekDescription",
	},
	{
		value: "previous-month",
		label: "Month over month",
		description: "A full month starting on the date you choose",
		labelKey: "comparison.monthOverMonth",
		descriptionKey: "comparison.monthDescription",
	},
];

interface UsageComparisonPickerProps {
	mode: UsageComparisonMode;
	currentRange: UsageDateRange;
	comparisonRange: UsageDateRange | null;
	disabled?: boolean;
	onChange: (mode: UsageComparisonMode, selectedRange?: UsageDateRange) => void;
}

function triggerLabel(
	mode: UsageComparisonMode,
	comparisonRange: UsageDateRange | null,
	t: (key: string, fallback?: string) => string,
	locale?: typeof vi,
): string {
	if (mode === "off") {
		return t("comparison.compare", "Compare");
	}
	if (comparisonRange && mode === "custom") {
		return formatUsageDateRange(comparisonRange, locale);
	}
	if (comparisonRange && mode === "previous-week") {
		return `${t("comparison.week", "Week")} · ${formatUsageDateRange(comparisonRange, locale)}`;
	}
	if (comparisonRange && mode === "previous-month") {
		return `${t("comparison.month", "Month")} · ${formatUsageDateRange(comparisonRange, locale)}`;
	}
	const option = OPTIONS.find((item) => item.value === mode);
	return option
		? t(option.labelKey, option.label)
		: t("comparison.compare", "Compare");
}

function ComparisonStartPicker({
	mode,
	currentRange,
	start,
	onStartChange,
	onBack,
	onSelect,
}: {
	mode: StartDateMode;
	currentRange: UsageDateRange;
	start: Date;
	onStartChange: (start: Date) => void;
	onBack: () => void;
	onSelect: (range: UsageDateRange) => void;
}) {
	const { language, t } = useLanguage();
	const locale = language === "vi" ? vi : undefined;
	const selectedRange = namedUsageComparisonRange(mode, start);
	const overlapsCurrent = selectedRange.to >= currentRange.from;

	return (
		<div className="space-y-3">
			<div className="flex items-start gap-2 px-3 pt-3 sm:px-0 sm:pt-0">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="-ml-2 h-8 w-8"
					onClick={onBack}
					aria-label={t("comparison.back", "Back to comparison options")}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<div>
					<p className="text-sm font-medium">
						{mode === "previous-week"
							? t("comparison.weekRange", "Week comparison")
							: t("comparison.monthRange", "Month comparison")}
					</p>
					<p className="text-xs text-muted-foreground">
						{mode === "previous-week"
							? t(
									"comparison.chooseStart7Day",
									"Choose a start date for the 7-day comparison",
								)
							: t(
									"comparison.chooseStartMonth",
									"Choose a start date for the one-month comparison",
								)}
					</p>
				</div>
			</div>
			<div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2">
				<p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
					{t("comparison.range", "Comparison range")}
				</p>
				<p className="mt-0.5 text-sm font-medium tabular-nums">
					{formatUsageDateRange(selectedRange, locale)}
				</p>
			</div>
			<Calendar
				mode="single"
				selected={start}
				onSelect={(day) => {
					if (day) {
						onStartChange(day);
					}
				}}
				defaultMonth={start}
				disabled={(day) =>
					namedUsageComparisonRange(mode, day).to >= currentRange.from
				}
				showOutsideDays={false}
				className="relative p-0"
			/>
			<div className="flex items-center justify-between border-t px-3 pt-3 sm:px-0">
				<p className="text-xs text-muted-foreground">
					{t("comparison.endsAutomatically", "Ends automatically")}
				</p>
				<Button
					type="button"
					size="sm"
					disabled={overlapsCurrent}
					onClick={() => onSelect(selectedRange)}
				>
					{t("comparison.compare", "Compare")}
				</Button>
			</div>
		</div>
	);
}

export function UsageComparisonPicker({
	mode,
	currentRange,
	comparisonRange,
	disabled = false,
	onChange,
}: UsageComparisonPickerProps) {
	const { language, t } = useLanguage();
	const locale = language === "vi" ? vi : undefined;
	const [open, setOpen] = useState(false);
	const [showCustom, setShowCustom] = useState(false);
	const [startDateMode, setStartDateMode] = useState<StartDateMode | null>(
		null,
	);
	const [comparisonStart, setComparisonStart] = useState(currentRange.from);
	const customDefault = comparisonRange ?? currentRange;
	const showCalendar = showCustom || startDateMode !== null;

	return (
		<Popover
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					setShowCustom(false);
					setStartDateMode(null);
				}
			}}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled}
					title={
						disabled
							? t(
									"comparison.unavailableAllTime",
									"Comparison is unavailable for all-time ranges",
								)
							: undefined
					}
					className={cn(
						"max-w-[220px]",
						mode !== "off" && "border-primary/40 bg-primary/5 text-foreground",
					)}
				>
					<GitCompare className="h-3.5 w-3.5" />
					<span className="truncate">
						{triggerLabel(mode, comparisonRange, t, locale)}
					</span>
					<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className={cn(
					"p-0",
					showCalendar
						? "max-h-[var(--radix-popover-content-available-height)] w-[calc(100vw-2rem)] overflow-y-auto p-3 sm:w-auto"
						: "w-80",
				)}
			>
				{showCustom ? (
					<DayRangePicker
						from={customDefault.from}
						to={customDefault.to}
						applyLabel="Compare"
						onCancel={() => setShowCustom(false)}
						onSelect={(from, to) => {
							onChange("custom", { from, to });
							setOpen(false);
						}}
					/>
				) : startDateMode ? (
					<ComparisonStartPicker
						mode={startDateMode}
						currentRange={currentRange}
						start={comparisonStart}
						onStartChange={setComparisonStart}
						onBack={() => setStartDateMode(null)}
						onSelect={(range) => {
							onChange(startDateMode, range);
							setStartDateMode(null);
							setOpen(false);
						}}
					/>
				) : (
					<div className="p-1">
						<div className="px-2 pb-2 pt-2">
							<p className="text-sm font-medium">
								{t("comparison.menuTitle", "Compare usage")}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("comparison.overlay", "Overlay ranges by elapsed day")}
							</p>
						</div>
						{OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									if (
										option.value === "previous-week" ||
										option.value === "previous-month"
									) {
										const defaultRange =
											mode === option.value && comparisonRange
												? comparisonRange
												: resolveUsageComparisonRange(
														option.value,
														currentRange,
													);
										if (defaultRange) {
											setComparisonStart(defaultRange.from);
										}
										setStartDateMode(option.value);
										return;
									}
									onChange(option.value);
									setOpen(false);
								}}
								className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
							>
								<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
									{mode === option.value && <Check className="h-3.5 w-3.5" />}
								</span>
								<span>
									<span className="block text-sm font-medium">
										{t(option.labelKey, option.label)}
									</span>
									<span className="block text-xs text-muted-foreground">
										{t(option.descriptionKey, option.description)}
									</span>
								</span>
							</button>
						))}
						<button
							type="button"
							onClick={() => setShowCustom(true)}
							className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
						>
							<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
								{mode === "custom" && <Check className="h-3.5 w-3.5" />}
							</span>
							<span>
								<span className="block text-sm font-medium">
									{t("comparison.customRange", "Custom range")}
								</span>
								<span className="block text-xs text-muted-foreground">
									{t(
										"comparison.chooseExactDays",
										"Choose exact comparison days",
									)}
								</span>
							</span>
						</button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
