/** Locale loader and key resolver. */

export const I18n = {
  locale: "en",
  core: {},
  pack: {},

  async load(locale, nationalityId) {
    this.locale = locale;
    const [core, pack] = await Promise.all([
      fetch(`data/locales/${locale}.json`).then((r) => {
        if (!r.ok) throw new Error(`locale ${locale}`);
        return r.json();
      }),
      fetch(`data/locales/nationalities/${nationalityId}.${locale}.json`).then((r) => {
        if (!r.ok) throw new Error(`pack locale ${nationalityId}.${locale}`);
        return r.json();
      }),
    ]);
    this.core = core;
    this.pack = pack;
  },

  t(key, vars = {}, root = "core") {
    if (!key) return "";
    const bag = root === "pack" ? this.pack : this.core;
    const parts = key.split(".");
    let cur = bag;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p];
      else {
        cur = undefined;
        break;
      }
    }
    let str = typeof cur === "string" ? cur : key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
    return str;
  },

  /**
   * Like t(), but escapes text and expands {lmt}/{uv} into italic full-name spans.
   * Other {vars} are HTML-escaped.
   */
  th(key, vars = {}, root = "core") {
    const raw = this.t(key, {}, root);
    const esc = (s) =>
      String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    const lmt = `<i class="term-italic">${esc(this.t("terms.lmt"))}</i>`;
    const uv = `<i class="term-italic">${esc(this.t("terms.uv"))}</i>`;
    return raw
      .split(/(\{lmt\}|\{uv\}|\{[a-zA-Z0-9_]+\})/g)
      .map((part) => {
        if (part === "{lmt}") return lmt;
        if (part === "{uv}") return uv;
        const m = part.match(/^\{([a-zA-Z0-9_]+)\}$/);
        if (m) return esc(vars[m[1]] ?? "");
        return esc(part);
      })
      .join("");
  },

  tp(key, vars = {}) {
    return this.t(key, vars, "pack");
  },
};
