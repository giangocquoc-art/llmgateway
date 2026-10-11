"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/lib/language";

export function LanguagePicker() {
	const { language, setLanguage, t } = useLanguage();

	return (
		<label className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
			<Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
			<span>{t("language.label", "Language")}</span>
			<select
				aria-label={t("language.label", "Language")}
				className="ml-auto max-w-28 rounded-md border border-border bg-background px-2 py-1 text-foreground"
				value={language}
				onChange={(event) =>
					setLanguage(event.target.value === "en" ? "en" : "vi")
				}
			>
				<option value="vi">{t("language.vietnamese", "Tiếng Việt")}</option>
				<option value="en">{t("language.english", "English")}</option>
			</select>
		</label>
	);
}
