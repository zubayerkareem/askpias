import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "askpias-theme";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Reads/writes the theme class on <html>. The site starts light and only the
 * toggle changes it — no system (prefers-color-scheme) detection.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    apply(currentTheme() === "dark" ? "light" : "dark");
  }, [apply]);

  return { theme, setTheme: apply, toggleTheme };
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'light';if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.classList.remove('dark');}})();`;
