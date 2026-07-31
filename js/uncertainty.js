/** Uncertainty / conflicting-source cards for contested fee readings. */

import { I18n } from "./i18n.js";

let data = null;

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

function adoptedReading(item) {
  return (
    (item.readings || []).find((r) => r.roleKey === "uncertainty.role.adopted") ||
    (item.readings || [])[0] ||
    null
  );
}

export const Uncertainty = {
  async load() {
    const res = await fetch("data/uncertainty.json");
    if (!res.ok) throw new Error("Failed to load uncertainty.json");
    data = await res.json();
    return data;
  },

  itemsForStep(stepId) {
    return (data?.items || []).filter((item) => (item.stepIds || []).includes(stepId));
  },

  overviewItems() {
    return (data?.items || []).filter((item) => item.showOnOverview);
  },

  renderItem(item) {
    if (!item) return "";
    const readings = item.readings || [];
    const adopted = adoptedReading(item);
    const spectrumClass = item.resolvedForPath ? "is-resolved" : "is-open";
    const readingHtml = readings
      .map((r) => {
        const role = I18n.t(r.roleKey);
        const meaning = I18n.t(r.meaningKey);
        const pageNote = r.pageUpdatedNoteKey ? I18n.t(r.pageUpdatedNoteKey) : "";
        const tier = I18n.t("ui.tier", { n: r.sourceTier });
        const isAdopted = adopted && r.id === adopted.id;
        return `
          <li class="uncertainty-reading ${isAdopted ? "is-adopted" : ""}" data-reading-id="${escAttr(r.id)}">
            <div class="uncertainty-reading-head">
              <span class="uncertainty-value">${esc(r.value)}</span>
              <span class="uncertainty-role">${esc(role)}</span>
            </div>
            <p class="uncertainty-meaning">${esc(meaning)}</p>
            <a class="uncertainty-source" href="${escAttr(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">
              ${esc(r.sourceName)}
            </a>
            <div class="uncertainty-meta">
              <span>${esc(tier)}</span>
              <span>${esc(I18n.t("uncertainty.verifiedOn", { date: r.verifiedDate }))}</span>
            </div>
            ${pageNote ? `<p class="uncertainty-page-note muted">${esc(pageNote)}</p>` : ""}
          </li>`;
      })
      .join("");

    return `
      <section class="uncertainty-card ${spectrumClass}" data-uncertainty-id="${escAttr(item.id)}">
        <header class="uncertainty-card-head">
          <p class="uncertainty-eyebrow">${esc(I18n.t("uncertainty.eyebrow"))}</p>
          <h3>${esc(I18n.t(item.titleKey))}</h3>
          <p>${esc(I18n.t(item.summaryKey))}</p>
        </header>
        <div class="uncertainty-spectrum" aria-hidden="true">
          <span class="spectrum-end">${esc(I18n.t("uncertainty.spectrum.conflict"))}</span>
          <span class="spectrum-track"><span class="spectrum-marker ${spectrumClass}"></span></span>
          <span class="spectrum-end">${esc(I18n.t("uncertainty.spectrum.resolved"))}</span>
        </div>
        <p class="uncertainty-spectrum-caption">${esc(I18n.t(item.spectrumKey))}</p>
        ${
          adopted
            ? `<p class="uncertainty-adopted">${esc(
                I18n.t("uncertainty.adopted", { value: adopted.value })
              )}</p>`
            : ""
        }
        <ul class="uncertainty-readings">${readingHtml}</ul>
      </section>`;
  },

  renderForStep(stepId) {
    return this.itemsForStep(stepId)
      .map((item) => this.renderItem(item))
      .join("");
  },

  renderOverview() {
    const items = this.overviewItems();
    if (!items.length) return "";
    return `
      <section class="overview-uncertainty">
        <h2>${esc(I18n.t("uncertainty.overviewTitle"))}</h2>
        <p class="muted">${esc(I18n.t("uncertainty.overviewIntro"))}</p>
        ${items.map((item) => this.renderItem(item)).join("")}
      </section>`;
  },
};
