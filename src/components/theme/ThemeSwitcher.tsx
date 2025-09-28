"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "app_theme"; // values: "light" | "dark" | "rose"

function applyTheme(theme: string) {
  const root = document.documentElement;
  root.classList.remove("dark", "theme-rose");
  switch (theme) {
    case "dark":
      root.classList.add("dark");
      break;
    case "rose":
      root.classList.add("theme-rose");
      break;
    default:
      // light - nothing extra
      break;
  }
}

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "rose">("light");

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as typeof theme) || "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const handleChange = (value: typeof theme) => {
    setTheme(value);
    localStorage.setItem(THEME_KEY, value);
    applyTheme(value);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 text-sm">
      <button
        type="button"
        onClick={() => handleChange("light")}
        className={`px-2 py-1 rounded-sm transition-colors ${
          theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
        aria-pressed={theme === "light"}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => handleChange("dark")}
        className={`px-2 py-1 rounded-sm transition-colors ${
          theme === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => handleChange("rose")}
        className={`px-2 py-1 rounded-sm transition-colors ${
          theme === "rose" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
        aria-pressed={theme === "rose"}
      >
        Rose
      </button>
    </div>
  );
};

export default ThemeSwitcher;