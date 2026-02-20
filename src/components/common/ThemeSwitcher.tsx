"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 flex items-center justify-center rounded-full opacity-0">
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden group"
      aria-label="Toggle Dark Mode"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:-translate-y-[150%] dark:opacity-0" />
      <Moon className="h-[1.2rem] w-[1.2rem] transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] opacity-0 dark:-translate-y-1/2 dark:opacity-100" />
    </button>
  );
}
