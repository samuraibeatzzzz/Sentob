"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ dark = false }: { dark?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Yorug' rejim" : "Tungi rejim"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        dark
          ? "border-cream-50/30 text-cream-50 hover:bg-cream-50/10"
          : "border-forest-800/20 text-forest-900 hover:bg-forest-900/5 dark:border-cream-50/30 dark:text-cream-50 dark:hover:bg-cream-50/10"
      )}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
