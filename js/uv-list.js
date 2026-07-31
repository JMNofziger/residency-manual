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
    // Always (re)wire — panel DOM is recreated on each render.
    if (root._uvClick) root.removeEventListener("click", root._uvClick);
    if (root._uvInput) {
      root.querySelector("[data-uv-search]")?.removeEventListener("input", root._uvInput);
    }
    if (root._uvToggle) {
      root.querySelector("[data-uv-toggle-all]")?.removeEventListener("change", root._uvToggle);
    }

    const search = root.querySelector("[data-uv-search]");
    const toggle = root.querySelector("[data-uv-toggle-all]");
    root._uvInput = (e) => {
      this.query = e.target.value || "";
      this.rerenderResults(root);
    };
    root._uvToggle = (e) => {
      this.showAllZagreb = !!e.target.checked;
      this.rerenderResults(root);
    };
    root._uvClick = (e) => {
      const btn = e.target.closest("[data-uv-candidate-id]");
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      const handler = root._onMarkCandidate;
      if (typeof handler !== "function") return;
      handler({
        id: btn.getAttribute("data-uv-candidate-id"),
        title: btn.getAttribute("data-uv-candidate-title"),
      });
    };
    search?.addEventListener("input", root._uvInput);
    toggle?.addEventListener("change", root._uvToggle);
    root.addEventListener("click", root._uvClick);
  },

  rerenderResults(root) {
    const caseData = root._caseData;
    const host = root.querySelector("[data-uv-results]");
    if (!host || !caseData) return;
    host.innerHTML = this.renderResults(caseData, root._uvCandidate || null);
  },

  renderResults(caseData, uvCandidate = null) {
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
            const marked = uvCandidate?.id === occ.id;
            return `
              <li class="${marked ? "is-marked" : ""}">
                <div class="uv-title-row">
                  <strong>${esc(title)}</strong>
                  ${nkdBadge}
                  ${marked ? `<span class="pill">${esc(I18n.t("ui.selected"))}</span>` : ""}
                </div>
                <p class="muted">${esc(regionLabel)}</p>
                ${relevance}
                ${seasonal}
                <button type="button" class="btn ${marked ? "done" : "accent"} uv-mark-btn"
                  data-uv-candidate-id="${escAttr(occ.id)}"
                  data-uv-candidate-title="${escAttr(title)}">
                  ${esc(marked ? I18n.t("ui.uvCandidateSelected") : I18n.t("ui.uvMarkCandidate"))}
                </button>
              </li>`;
          })
          .join("")}
      </ul>`;
  },

  render(caseData, uvCandidate = null) {
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

    const selectedBanner = uvCandidate
      ? `<aside class="uv-selected-banner" role="status">
          <p>${I18n.th("ui.uvCandidateChipHtml", { title: uvCandidate.title })}</p>
          <button type="button" class="btn ghost" id="btn-clear-uv-candidate">${I18n.th(
            "ui.uvClearCandidate"
          )}</button>
        </aside>`
      : "";

    return `
      <section class="card uv-panel" id="uv-panel" data-uv-panel>
        <div class="panel-head">
          <h3>${I18n.th("uv.panelTitle")}</h3>
          <span class="pill">${esc(I18n.t("uv.regionChip", { region: I18n.t("uv.regions." + region) }))}</span>
          <span class="pill">${esc(I18n.t("uv.nkdChip", { nkd }))}</span>
        </div>
        <p class="banner warn">${esc(I18n.t(meta.noteKey))}</p>
        <p>${I18n.th("uv.panelIntro")}</p>
        <p class="muted">${I18n.th("uv.art110Note")}</p>
        ${selectedBanner}
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
            <span>${I18n.th("uv.searchLabel")}</span>
            <input type="search" data-uv-search value="${escAttr(this.query)}" placeholder="${escAttr(
              I18n.t("uv.searchPlaceholder")
            )}" />
          </label>
          <label class="check-row">
            <input type="checkbox" data-uv-toggle-all ${this.showAllZagreb ? "checked" : ""} />
            <span>${I18n.th("uv.toggleAllZagreb")}</span>
          </label>
        </div>
        <div data-uv-results>${this.renderResults(caseData, uvCandidate)}</div>
        <p class="muted">${I18n.th("uv.noTitleShopping")}</p>
      </section>
    `;
  },

  afterMount(root, caseData, options = {}) {
    if (!root) return;
    root._caseData = caseData;
    root._uvCandidate = options.uvCandidate || null;
    root._onMarkCandidate = options.onMarkCandidate || null;
    this.bind(root);
  },
};
