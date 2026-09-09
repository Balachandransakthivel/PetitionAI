import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-1 text-xs"
        aria-label="Select Language"
        title="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-[11px] font-semibold">{i18n.language?.slice(0, 2) || "en"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 min-w-[130px] overflow-hidden">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span>{lang.label}</span>
              {i18n.language?.startsWith(lang.code) && (
                <Check className="w-3 h-3 text-gold-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
