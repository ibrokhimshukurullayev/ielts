const THEME_KEY = "ielts_theme";

export function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(THEME_KEY) ?? "light";
}

export function applyTheme(theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
}
