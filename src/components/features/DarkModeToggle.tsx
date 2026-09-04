import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("petitionai-theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("petitionai-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`w-4 h-4 absolute transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"} text-amber-500`} />
      <Moon className={`w-4 h-4 absolute transition-all ${isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"} text-blue-400`} />
    </button>
  );
}
