import { I18n } from "./i18n.js";
import { renderFactList } from "./facts.js";

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escAttr(s) {
  return esc(s).replaceAll("'", "&#39;");
}

function appliesToRegion(occ, regionId) {
  const regions = occ.regions || [];
  return regions.includes("all") || regions.includes(regionId);
}

function matchesNkd(occ, nkd) {
  return (occ.nkdRelevant || []).includes(String(nkd));
}

export const UvList = {
  data: null,
  query: "",
  showAllZagreb: false,

  async load() {
    const res = await fetch("data/uv-occupations.json");
    if (!res.ok) throw new Error("Failed to load uv-occupations.json");
    this.data = await res.json();
    return this.data;
  },

  filtered(caseData) {
    if (!this.data) return [];
    const region = caseData.employer.hzzRegion || caseData.employer.policeAdmin || "grad_zagreb";
    const nkd = caseData.employer.nkd2025;
    const q = this.query.trim().toLowerCase();

    return this.data.occupations.filter((occ) => {
      if (!appliesToRegion(occ, region)) return false;
      if (!this.showAllZagreb && !matchesNkd(occ, nkd)) return false;
      if (!q) return true;
      return (
        occ.titleHr.toLowerCase().includes(q) ||
        occ.titleEn.toLowerCase().includes(q) ||
        occ.id.includes(q)
      );
    });
  },

  bind(root) {
    if (!root) return;
    if (root._uvBound) return;
    root._uvBound = true;
    const search = root.querySelector("[data-uv-search]");
    const toggle = root.querySelector("[data-uv-toggle-all]");
    search?.addEventListener("input", (e) => {
      this.query = e.target.value || "";
      this.rerenderResults(root);
    });
    toggle?.addEventListener("change", (e) => {
      this.showAllZagreb = !!e.target.checked;
      this.rerenderResults(root);
    });
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-uv-candidate-id]");
      if (!btn || !root.contains(btn)) return;
      const handler = root._onMarkCandidate;
      if (typeof handler !== "function") return;
      handler({
        id: btn.getAttribute("data-uv-candidate-id"),
        title: btn.getAttribute("data-uv-candidate-title"),
      });
    });
  },

  rerenderResults(root) {
    const caseData = root._caseData;
    const host = root.querySelector("[data-uv-results]");
    if (!host || !caseData) return;
    host.innerHTML = this.renderResults(caseData);
  },

  renderResults(caseData) {
    const rows = this.filtered(caseData);
    if (!rows.length) {
      return `<p class="uv-empty">${esc(I18n.t("uv.emptyState"))}</p>`;
    }
    return `
      <ul class="uv-results">
        ${rows
          .map((occ) => {
            const title = I18n.locale === "hr" ? occ.titleHr : `${occ.titleEn} · ${occ.titleHr}`;
            const nkdBadge = (occ.nkdRelevant || []).includes(caseData.employer.nkd2025)
              ? `<span class="pill">${esc(I18n.t("uv.nkdRelevantBadge"))}</span>`
              : "";
            const relevance = occ.relevanceNoteKey
              ? `<p class="muted">${esc(I18n.t(occ.relevanceNoteKey))}</p>`
              : "";
            const seasonal = occ.seasonalNoteKey
              ? `<p class="muted">${esc(I18n.t(occ.seasonalNoteKey))}</p>`
              : "";
            const regionLabel =
              (occ.regions || []).includes("all")
                ? I18n.t("uv.regionAll")
                : I18n.t("uv.regionLimited");
            return `
              <li>
                <div class="uv-title-row">
                  <strong>${esc(title)}</strong>
                  ${nkdBadge}
                </div>
                <p class="muted">${esc(regionLabel)}</p>
                ${relevance}
                ${seasonal}
                <button type="button" class="btn ghost uv-mark-btn"
                  data-uv-candidate-id="${escAttr(occ.id)}"
                  data-uv-candidate-title="${escAttr(title)}">
                  ${esc(I18n.t("ui.uvMarkCandidate"))}
                </button>
              </li>`;
          })
          .join("")}
      </ul>`;
  },

  render(caseData) {
    if (!this.data) return "";
    const meta = this.data.listMeta;
    const metaFact = {
      value: meta.value,
      labelKey: meta.labelKey,
      sourceUrl: meta.sourceUrl,
      sourceTier: meta.sourceTier,
      sourceName: meta.sourceName,
      verifiedDate: meta.verifiedDate,
    };
    const region = caseData.employer.hzzRegion || "grad_zagreb";
    const nkd = caseData.employer.nkd2025;

    const html = `
      <section class="card uv-panel" id="uv-panel" data-uv-panel>
        <div class="panel-head">
          <h3>${esc(I18n.t("uv.panelTitle"))}</h3>
          <span class="pill">${esc(I18n.t("uv.regionChip", { region: I18n.t("uv.regions." + region) }))}</span>
          <span class="pill">${esc(I18n.t("uv.nkdChip", { nkd }))}</span>
        </div>
        <p class="banner warn">${esc(I18n.t(meta.noteKey))}</p>
        <p>${esc(I18n.t("uv.panelIntro"))}</p>
        <p class="muted">${esc(I18n.t("uv.art110Note"))}</p>
        ${renderFactList([metaFact])}
        <p class="muted">
          <a href="${escAttr(meta.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(
            I18n.t("uv.openPdf")
          )}</a>
          ·
          <a href="${escAttr(meta.hubUrl)}" target="_blank" rel="noopener noreferrer">${esc(
            I18n.t("uv.openHub")
          )}</a>
        </p>
        <div class="uv-controls">
          <label class="uv-search-label">
            <span>${esc(I18n.t("uv.searchLabel"))}</span>
            <input type="search" data-uv-search value="${escAttr(this.query)}" placeholder="${escAttr(
              I18n.t("uv.searchPlaceholder")
            )}" />
          </label>
          <label class="check-row">
            <input type="checkbox" data-uv-toggle-all ${this.showAllZagreb ? "checked" : ""} />
            <span>${esc(I18n.t("uv.toggleAllZagreb"))}</span>
          </label>
        </div>
        <div data-uv-results>${this.renderResults(caseData)}</div>
        <p class="muted">${esc(I18n.t("uv.noTitleShopping"))}</p>
      </section>
    `;
    return html;
  },

  afterMount(root, caseData, options = {}) {
    if (!root) return;
    root._caseData = caseData;
    root._onMarkCandidate = options.onMarkCandidate || null;
    this.bind(root);
  },
};
