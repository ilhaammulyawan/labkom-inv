import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getTranslation, languages, type LanguageCode, type TranslationKeys } from "@/i18n";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: TranslationKeys) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "id",
  setLang: () => {},
  t: (key) => key,
  dir: "ltr",
  isRtl: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem("app_language") as LanguageCode;
    return stored && ["id", "en", "ar"].includes(stored) ? stored : "id";
  });

  const meta = languages.find((l) => l.code === lang) ?? languages[0];

  // Load language from profile on login
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.language && ["id", "en", "ar"].includes(data.language)) {
          setLangState(data.language as LanguageCode);
          localStorage.setItem("app_language", data.language);
        }
      });
  }, [user]);

  // Apply dir and lang to <html>
  useEffect(() => {
    document.documentElement.setAttribute("dir", meta.dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, meta.dir]);

  const setLang = useCallback(
    (newLang: LanguageCode) => {
      setLangState(newLang);
      localStorage.setItem("app_language", newLang);
      // Persist to DB if logged in
      if (user) {
        supabase
          .from("profiles")
          .update({ language: newLang, updated_at: new Date().toISOString() })
          .eq("id", user.id)
          .then(() => {});
      }
    },
    [user]
  );

  const t = useCallback(
    (key: TranslationKeys) => getTranslation(lang, key),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: meta.dir, isRtl: meta.dir === "rtl" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
