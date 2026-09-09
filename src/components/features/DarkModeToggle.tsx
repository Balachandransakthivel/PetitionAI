import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("petitionai-theme");
      if (stored) return stored === "dark";
      return document.documentElement.classList.contains("dark") || 
             window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("petitionai-theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  }, [isDark]);

  useEffect(() => {
    function handleStorage() {
      const theme = localStorage.getItem("petitionai-theme");
      if (theme) {
        setIsDark(theme === "dark");
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-white/20 dark:border-navy-700/60 flex items-center justify-center opacity-0" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsDark(prev => !prev)}
      className="relative w-9 h-9 rounded-full border border-white/20 dark:border-navy-700/60 bg-white/10 dark:bg-navy-800/80 hover:bg-white/20 dark:hover:bg-navy-700 flex items-center justify-center transition-all duration-200 text-white"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`w-4 h-4 absolute transition-all duration-200 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"} text-amber-300`} />
      <Moon className={`w-4 h-4 absolute transition-all duration-200 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"} text-blue-300`} />
    </button>
  );
}

