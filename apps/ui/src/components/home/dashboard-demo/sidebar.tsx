"use client";

import {
	Building2,
	Check,
	ChevronsUpDown,
	ChevronUp,
	ComputerIcon,
	CreditCard,
	ExternalLink,
	MoonIcon,
	PlusCircle,
	Search,
	Shield,
	SunIcon,
	User as UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";

import { AnimatedSettings } from "@/components/dashboard/animated-nav-icons";
import { OrganizationAvatar } from "@/components/dashboard/organization-avatar";
import { DEMO_ORG, DEMO_USER } from "@/components/home/dashboard-demo-data";
import { Button } from "@/lib/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/lib/components/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/lib/components/tooltip";
import Logo, { LogoLockup } from "@/lib/icons/Logo";
import { useLanguage } from "@/lib/language";

import { READ_ONLY_MESSAGE, useDemo } from "./context";
import {
	ORGANIZATION_NAVIGATION,
	ORGANIZATION_SETTINGS,
	PROJECT_NAVIGATION,
	PROJECT_SETTINGS,
	SEARCHABLE_LINKS,
	TOOLS_RESOURCES,
	isOrgView,
	type NavLink,
	type SearchableLink,
} from "./nav";
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "./sidebar-primitives";

const PRODUCTS = [
	{
		id: "gateway",
		name: "PShareHub AI Gateway",
		description: "Cổng API và mức sử dụng",
		icon: Logo,
	},
] as const;

function EnterpriseIndicator() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span
					aria-label="Enterprise feature"
					className="ml-auto flex items-center text-blue-500/70 group-data-[collapsible=icon]:hidden dark:text-blue-400/70"
				>
					<Building2 className="h-3.5 w-3.5" />
				</span>
			</TooltipTrigger>
			<TooltipContent side="right">Enterprise feature</TooltipContent>
		</Tooltip>
	);
}

function NavItem({
	item,
	isActive,
	collapsed,
	onSelect,
}: {
	item: NavLink;
	isActive: boolean;
	collapsed: boolean;
	onSelect: (href: string) => void;
}) {
	const { t } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);
	const Icon = item.icon;
	const label = t(`nav.${item.label}`, item.label);

	return (
		<SidebarMenuItem
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<SidebarMenuButton
				isActive={isActive}
				tooltip={label}
				collapsed={collapsed}
				onClick={() => onSelect(item.href)}
			>
				{Icon && <Icon isHovered={isHovered} />}
				<span>{label}</span>
				{item.external && (
					<ExternalLink className="ml-auto h-3 w-3 group-data-[collapsible=icon]:hidden" />
				)}
				{item.enterprise && <EnterpriseIndicator />}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function SettingsItem({
	parentHref,
	parentActive,
	items,
	isActive,
	collapsed,
	onSelect,
}: {
	parentHref: string;
	parentActive: boolean;
	items: NavLink[];
	isActive: (href: string) => boolean;
	collapsed: boolean;
	onSelect: (href: string) => void;
}) {
	const { t } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);
	const settingsLabel = t("nav.Settings", "Settings");

	return (
		<SidebarMenuItem
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<SidebarMenuButton
				isActive={parentActive}
				tooltip={settingsLabel}
				collapsed={collapsed}
				onClick={() => onSelect(parentHref)}
			>
				<AnimatedSettings isHovered={isHovered} />
				<span>{settingsLabel}</span>
			</SidebarMenuButton>
			<SidebarMenuSub className="ml-7">
				{items.map((item) => (
					<SidebarMenuSubItem key={item.href}>
						<SidebarMenuSubButton
							isActive={isActive(item.href)}
							onClick={() => onSelect(item.href)}
						>
							<span>{t(`nav.${item.label}`, item.label)}</span>
							{item.enterprise && <EnterpriseIndicator />}
						</SidebarMenuSubButton>
					</SidebarMenuSubItem>
				))}
			</SidebarMenuSub>
		</SidebarMenuItem>
	);
}

function SearchResultItem({
	link,
	collapsed,
	onSelect,
}: {
	link: SearchableLink;
	collapsed: boolean;
	onSelect: (href: string) => void;
}) {
	const { t } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);
	const Icon = link.icon;
	const label = t(`nav.${link.label}`, link.label);
	const section =
		{
			Project: t("demo.section.project", "Project"),
			"Project Settings": t("demo.section.projectSettings", "Project Settings"),
			Organization: t("demo.section.organization", "Organization"),
			"Org Settings": t("demo.section.orgSettings", "Org Settings"),
			Tools: t("demo.section.tools", "Tools"),
		}[link.section] ?? link.section;

	return (
		<SidebarMenuItem
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<SidebarMenuButton
				tooltip={label}
				collapsed={collapsed}
				onClick={() => onSelect(link.href)}
			>
				{Icon && <Icon isHovered={isHovered} />}
				<span className="truncate">{label}</span>
				<span className="ml-auto flex items-center gap-1 text-[0.65rem] text-muted-foreground">
					{section}
					{link.external && <ExternalLink className="h-3 w-3" />}
					{link.enterprise && (
						<Building2 className="h-3.5 w-3.5 text-blue-500/70 dark:text-blue-400/70" />
					)}
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function ThemeSelect() {
	const { t } = useLanguage();
	const { theme, setTheme } = useTheme();

	return (
		<Select value={theme} onValueChange={setTheme}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder={t("demo.selectTheme", "Select theme")} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">
					<div className="flex items-center">
						<SunIcon className="mr-2 h-4 w-4" />
						{t("demo.light", "Light")}
					</div>
				</SelectItem>
				<SelectItem value="dark">
					<div className="flex items-center">
						<MoonIcon className="mr-2 h-4 w-4" />
						{t("demo.dark", "Dark")}
					</div>
				</SelectItem>
				<SelectItem value="system">
					<div className="flex items-center">
						<ComputerIcon className="mr-2 h-4 w-4" />
						{t("demo.system", "System")}
						<span className="ml-2 text-xs text-muted-foreground">
							({t("demo.default", "Default")})
						</span>
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

export function ProductSwitcherMenu({
	side,
	children,
}: {
	side: "bottom" | "right";
	children: React.ReactElement;
}) {
	const { t } = useLanguage();
	const { navigate, notify } = useDemo();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				aria-label={t(
					"demo.switchProduct",
					"Switch product, current product PShareHub AI Gateway",
				)}
			>
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side={side}
				align="start"
				sideOffset={6}
				collisionPadding={16}
				className="w-72 max-w-[calc(100vw-2rem)] rounded-xl p-2"
			>
				<DropdownMenuLabel className="px-2 pb-2 text-xs font-medium text-muted-foreground">
					Sản phẩm
				</DropdownMenuLabel>
				{PRODUCTS.map((product) => (
					<DropdownMenuItem
						key={product.id}
						className="rounded-lg p-2"
						onSelect={() =>
							product.id === "gateway"
								? navigate("")
								: notify("Sản phẩm này chưa khả dụng trong bản xem trước.")
						}
					>
						<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
							<product.icon
								className="size-6 text-foreground"
								aria-hidden="true"
							/>
						</span>
						<span className="min-w-0 flex-1">
							<span className="block font-medium">{product.name}</span>
							<span className="block text-xs text-muted-foreground">
								{product.description}
							</span>
						</span>
						{product.id === "gateway" && (
							<Check
								className="size-4 shrink-0 text-muted-foreground"
								aria-hidden="true"
							/>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DemoSidebarBody({
	collapsed = false,
	onNavigate,
}: {
	collapsed?: boolean;
	onNavigate?: () => void;
}) {
	const { t } = useLanguage();
	const { view, navigate, notify } = useDemo();
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const select = (href: string) => {
		navigate(href);
		onNavigate?.();
	};

	const isActive = (href: string) => {
		if (href === "") {
			return view === "";
		}
		if (href.startsWith("org/") !== isOrgView(view)) {
			return false;
		}
		return view === href;
	};

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const matches = normalizedQuery
		? SEARCHABLE_LINKS.filter((link) => {
				const label = t(`nav.${link.label}`, link.label).toLowerCase();
				const sectionKey = {
					Project: "demo.section.project",
					"Project Settings": "demo.section.projectSettings",
					Organization: "demo.section.organization",
					"Org Settings": "demo.section.orgSettings",
					Tools: "demo.section.tools",
				}[link.section];
				const section = sectionKey
					? t(sectionKey, link.section).toLowerCase()
					: link.section.toLowerCase();
				return (
					label.includes(normalizedQuery) || section.includes(normalizedQuery)
				);
			})
		: [];

	const selectSearchResult = (href: string) => {
		setSearchQuery("");
		searchInputRef.current?.blur();
		select(href);
	};

	return (
		<>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<ProductSwitcherMenu side={collapsed ? "right" : "bottom"}>
							<SidebarMenuButton
								size="lg"
								tooltip={t("demo.switchProductShort", "Switch product")}
								collapsed={collapsed}
								className="data-[state=open]:bg-sidebar-accent"
							>
								<div className="hidden aspect-square size-8 items-center justify-center group-data-[collapsible=icon]:flex">
									<Logo className="size-6" />
								</div>
								<span className="group-data-[collapsible=icon]:hidden">
									<LogoLockup className="h-6 w-auto" />
								</span>
								<ChevronsUpDown
									className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
									aria-hidden="true"
								/>
							</SidebarMenuButton>
						</ProductSwitcherMenu>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="group-data-[collapsible=icon]:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex min-w-[180px] items-center justify-start gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							>
								<OrganizationAvatar
									organization={DEMO_ORG}
									className="flex-shrink-0"
								/>
								<span className="truncate">{DEMO_ORG.name}</span>
								<ChevronsUpDown className="ml-auto h-4 w-4 flex-shrink-0 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-60 border-border bg-background text-foreground shadow-xl">
							<DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
								{t("demo.organizations", "Organizations")}
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuItem className="cursor-pointer gap-2 px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent">
								<OrganizationAvatar
									organization={DEMO_ORG}
									className="flex-shrink-0"
								/>
								<span className="truncate">{DEMO_ORG.name}</span>
								<Check className="ml-auto h-4 w-4 flex-shrink-0" />
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuItem
								onSelect={() => notify(READ_ONLY_MESSAGE)}
								className="cursor-pointer px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent"
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								{t("demo.newOrganization", "New Organization")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="relative px-2 pb-1 group-data-[collapsible=icon]:hidden">
					<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-[calc(50%+2px)] text-muted-foreground" />
					<SidebarInput
						ref={searchInputRef}
						placeholder={t("nav.Search links...", "Search links...")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setSearchQuery("");
							} else if (e.key === "Enter") {
								e.preventDefault();
								const first = matches[0];
								if (first) {
									selectSearchResult(first.href);
								}
							}
						}}
						className="pl-8 pr-8"
						aria-label={t("nav.Search links...", "Search sidebar links")}
					/>
					{!searchQuery && (
						<kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-[calc(50%+2px)] rounded border border-border bg-muted px-1.5 font-mono text-[0.65rem] text-muted-foreground">
							/
						</kbd>
					)}
				</div>
			</SidebarHeader>
			<SidebarContent>
				{normalizedQuery ? (
					<SidebarGroup>
						<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
							{t("demo.searchResults", "Search results")}
						</SidebarGroupLabel>
						<SidebarGroupContent className="mt-2">
							{matches.length === 0 ? (
								<p className="px-2 py-1.5 text-sm text-muted-foreground">
									{t("demo.noSearchMatch", "No links match your search.")}
								</p>
							) : (
								<SidebarMenu>
									{matches.map((link) => (
										<SearchResultItem
											key={`${link.section}-${link.href}`}
											link={link}
											collapsed={collapsed}
											onSelect={selectSearchResult}
										/>
									))}
								</SidebarMenu>
							)}
						</SidebarGroupContent>
					</SidebarGroup>
				) : (
					<>
						<SidebarGroup>
							<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
								{t("nav.Project", "Project")}
							</SidebarGroupLabel>
							<SidebarGroupContent className="mt-2">
								<SidebarMenu>
									{PROJECT_NAVIGATION.map((item) => (
										<NavItem
											key={item.href}
											item={item}
											isActive={isActive(item.href)}
											collapsed={collapsed}
											onSelect={select}
										/>
									))}
									<SettingsItem
										parentHref="settings/preferences"
										parentActive={isActive("settings/preferences")}
										items={PROJECT_SETTINGS}
										isActive={isActive}
										collapsed={collapsed}
										onSelect={select}
									/>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
								{t("nav.Organization", "Organization")}
							</SidebarGroupLabel>
							<SidebarGroupContent className="mt-2">
								<SidebarMenu>
									{ORGANIZATION_NAVIGATION.map((item) => (
										<NavItem
											key={item.href}
											item={item}
											isActive={isActive(item.href)}
											collapsed={collapsed}
											onSelect={select}
										/>
									))}
									<SettingsItem
										parentHref="org/billing"
										parentActive={ORGANIZATION_SETTINGS.some((item) =>
											isActive(item.href),
										)}
										items={ORGANIZATION_SETTINGS}
										isActive={isActive}
										collapsed={collapsed}
										onSelect={select}
									/>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
								{t("nav.Tools & Resources", "Tools & Resources")}
							</SidebarGroupLabel>
							<SidebarGroupContent className="mt-2">
								<SidebarMenu>
									{TOOLS_RESOURCES.map((item) => (
										<NavItem
											key={item.href}
											item={item}
											isActive={isActive(item.href)}
											collapsed={collapsed}
											onSelect={select}
										/>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<div className="px-2 py-1.5 group-data-[collapsible=icon]:hidden">
					<button
						type="button"
						onClick={() => notify(READ_ONLY_MESSAGE)}
						className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<div className="flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-muted-foreground" />
							<div className="flex flex-col">
								<span className="text-sm font-medium">
									{t("demo.credits", "Credits")}
								</span>
								<span className="text-xs text-muted-foreground">
									${DEMO_ORG.credits.toFixed(2)}
								</span>
							</div>
						</div>
						<span className="text-xs text-muted-foreground">
							{t("demo.add", "Add")}
						</span>
					</button>
				</div>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
										<span className="text-xs font-semibold">
											{DEMO_USER.initials}
										</span>
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
										<span className="truncate font-semibold">
											{DEMO_USER.name}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											{DEMO_USER.email}
										</span>
									</div>
									<ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="top"
								align="end"
								sideOffset={4}
							>
								<div className="p-2">
									<ThemeSelect />
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={() => select("settings/account")}>
									<UserIcon className="mr-2 h-4 w-4" />
									{t("nav.Account", "Account")}
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => select("org/billing")}>
									<CreditCard className="mr-2 h-4 w-4" />
									{t("nav.Billing", "Billing")}
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => select("settings/security")}>
									<Shield className="mr-2 h-4 w-4" />
									{t("nav.Security", "Security")}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={() => notify(READ_ONLY_MESSAGE)}>
									<span>{t("nav.Log out", "Log out")}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</>
	);
}
