import { id, type TranslationKeys } from "./id";
import { en } from "./en";
import { ar } from "./ar";

export type LanguageCode = "id" | "en" | "ar";

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const languages: LanguageMeta[] = [
  { code: "id", label: "Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

const translations: Record<LanguageCode, Record<TranslationKeys, string>> = {
  id,
  en,
  ar,
};

export function getTranslation(lang: LanguageCode, key: TranslationKeys): string {
  return translations[lang]?.[key] ?? translations.id[key] ?? key;
}

export type { TranslationKeys };
