import { BookOpen, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { guideChaptersId } from "@/i18n/guide-id";
import { guideChaptersEn } from "@/i18n/guide-en";
import { guideChaptersAr } from "@/i18n/guide-ar";
import type { LanguageCode } from "@/i18n";

const guideByLang: Record<LanguageCode, typeof guideChaptersId> = {
  id: guideChaptersId,
  en: guideChaptersEn,
  ar: guideChaptersAr,
};

const Guide = () => {
  const { t, lang } = useLanguage();
  const chapters = guideByLang[lang];
  const [searchQuery, setSearchQuery] = useState("");
  const [openChapter, setOpenChapter] = useState<string | null>(chapters[0].title);

  const filteredChapters = chapters.map(chapter => {
    if (!searchQuery) return chapter;
    const query = searchQuery.toLowerCase();
    const matchChapterTitle = chapter.title.toLowerCase().includes(query);
    const matchedSections = chapter.sections.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.content.toLowerCase().includes(query)
    );
    if (matchChapterTitle) return chapter;
    else if (matchedSections.length > 0) return { ...chapter, sections: matchedSections };
    return null;
  }).filter(Boolean) as typeof chapters;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><BookOpen className="h-6 w-6" /> {t("guideTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("guideSubtitle")}</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder={t("searchGuide")}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => (
            <div key={chapter.title} className="kpi-card p-0 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setOpenChapter(openChapter === chapter.title ? null : chapter.title)}
              >
                <span className="text-sm font-semibold">{chapter.title}</span>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${(openChapter === chapter.title || searchQuery) ? 'rotate-90' : ''}`} />
              </button>
              {(openChapter === chapter.title || searchQuery) && (
                <div className="border-t border-border px-4 pb-4 space-y-4 animate-fade-in">
                  {chapter.sections.map((section, si) => (
                    <div key={si} className="pt-4">
                      <h4 className="text-xs font-semibold text-primary mb-2">{section.title}</h4>
                      <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground kpi-card">
            {t("noGuideFound")} "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
