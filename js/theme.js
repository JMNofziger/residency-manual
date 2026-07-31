/** Dark-first theme toggle with localStorage. */

const THEME_KEY = "residency-runbook:theme";

export const Theme = {
  get() {
    return localStorage.getItem(THEME_KEY) || "dark";
  },

  apply(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    return next;
  },

  toggle() {
    return this.apply(this.get() === "dark" ? "light" : "dark");
  },

  init() {
    this.apply(this.get());
  },
};
