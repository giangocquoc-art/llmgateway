import { Suspense } from "react";

import { LocalizedText } from "@/components/localized-text";
import { ReadonlyIdField } from "@/components/settings/readonly-id-field";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/card";

import { ArchiveProjectSettings } from "./_components/archive-project";
import { CachingSettingsRsc } from "./_components/caching-settings-rsc";
import { ProjectModeSettingsRsc } from "./_components/project-mode-settings-rsc";
import { ProjectNameSettingsRsc } from "./_components/project-name-settings-rsc";
import { CachingSettingsSkeleton } from "./_skeletons/caching-settings-skeleton";
import { ProjectModeSkeleton } from "./_skeletons/project-mode-skeleton";
import { ProjectNameSkeleton } from "./_skeletons/project-name-skeleton";

export default async function PreferencesPage({
	params,
}: {
	params: Promise<{ orgId: string; projectId: string }>;
}) {
	const { orgId, projectId } = await params;

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
				<div className="max-w-3xl mx-auto space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-3xl font-bold tracking-tight">
							<LocalizedText
								translationKey="settings.title"
								fallback="Preferences"
							/>
						</h2>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>
								<LocalizedText
									translationKey="settings.projectId"
									fallback="Project ID"
								/>
							</CardTitle>
							<CardDescription>
								<LocalizedText
									translationKey="settings.projectIdDescription"
									fallback="Use this ID when referencing your project in the API or with support."
								/>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ReadonlyIdField
								id="projectId"
								value={projectId}
								copyAriaLabel="Copy project ID"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>
								<LocalizedText
									translationKey="settings.projectName"
									fallback="Project Name"
								/>
							</CardTitle>
							<CardDescription>
								<LocalizedText
									translationKey="settings.projectNameDescription"
									fallback="Update your project's display name"
								/>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProjectNameSkeleton />}>
								<ProjectNameSettingsRsc orgId={orgId} projectId={projectId} />
							</Suspense>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>
								<LocalizedText
									translationKey="settings.projectMode"
									fallback="Project Mode"
								/>
							</CardTitle>
							<CardDescription>
								<LocalizedText
									translationKey="settings.projectModeDescription"
									fallback="Configure how your organization handles projects"
								/>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProjectModeSkeleton />}>
								<ProjectModeSettingsRsc orgId={orgId} projectId={projectId} />
							</Suspense>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>
								<LocalizedText
									translationKey="settings.caching"
									fallback="Caching"
								/>
							</CardTitle>
							<CardDescription>
								<LocalizedText
									translationKey="settings.cachingDescription"
									fallback="Configure provider prompt caching and gateway response caching"
								/>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<CachingSettingsSkeleton />}>
								<CachingSettingsRsc orgId={orgId} projectId={projectId} />
							</Suspense>
						</CardContent>
					</Card>

					<Card className="border-destructive/20">
						<CardHeader>
							<CardTitle className="text-destructive">
								<LocalizedText
									translationKey="settings.dangerZone"
									fallback="Danger Zone"
								/>
							</CardTitle>
							<CardDescription>
								<LocalizedText
									translationKey="settings.irreversible"
									fallback="Irreversible and destructive actions"
								/>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<div>Loading...</div>}>
								<ArchiveProjectSettings orgId={orgId} projectId={projectId} />
							</Suspense>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
