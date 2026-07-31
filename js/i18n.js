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

  tp(key, vars = {}) {
    return this.t(key, vars, "pack");
  },
};
