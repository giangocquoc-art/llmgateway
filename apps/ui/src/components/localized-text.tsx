"use client";

import { useLanguage } from "@/lib/language";

export function LocalizedText({
	translationKey,
	fallback,
}: {
	translationKey: string;
	fallback: string;
}) {
	const { t } = useLanguage();
	return t(translationKey, fallback);
}
