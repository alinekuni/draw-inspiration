"use client";

import { useTranslation } from "@/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  const toggle = () => setLang(lang === "en" ? "pt-BR" : "en");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "Switch to Portuguese" : "Mudar para inglês"}
      className="w-10 h-8 flex items-center justify-center
                 text-ink/30 hover:text-ink/55 transition-colors active:scale-90"
    >
      <span className="font-body text-[9px] tracking-[0.12em] uppercase select-none">
        {lang === "en" ? "PT" : "EN"}
      </span>
    </button>
  );
}
