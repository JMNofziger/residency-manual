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

export const Art99 = {
  data: null,

  async load() {
    const res = await fetch("data/art99-checks.json");
    if (!res.ok) throw new Error("Failed to load art99-checks.json");
    this.data = await res.json();
    return this.data;
  },

  checkIds() {
    return (this.data?.checks || []).map((c) => `art99:${c.id}`);
  },

  allComplete(isChecked) {
    const ids = this.checkIds();
    return ids.length > 0 && ids.every((id) => isChecked(id));
  },

  syncParentChecklist(isChecked, setChecked) {
    if (!this.data?.parentChecklistId) return;
    const parentId = `core:${this.data.parentChecklistId}`;
    setChecked(parentId, this.allComplete(isChecked));
  },

  render(isChecked) {
    if (!this.data) return "";
    const checks = [...this.data.checks].sort((a, b) => a.order - b.order);
    const done = checks.filter((c) => isChecked(`art99:${c.id}`)).length;

    return `
      <section class="card art99-panel" id="art99-panel">
        <div class="panel-head">
          <h3>${esc(I18n.t(this.data.titleKey))}</h3>
          <span class="pill">${esc(I18n.t("art99.progress", { done, total: checks.length }))}</span>
        </div>
        <p class="muted">${esc(I18n.t(this.data.introKey))}</p>
        <p class="muted">
          <a href="${escAttr(this.data.sourceHub.url)}" target="_blank" rel="noopener noreferrer">${esc(
            I18n.t(this.data.sourceHub.labelKey)
          )}</a>
          <span class="fact-tier">${esc(I18n.t("ui.tier", { n: this.data.sourceHub.tier }))}</span>
        </p>
        <ol class="art99-list">
          ${checks
            .map((check) => {
              const id = `art99:${check.id}`;
              const how = (check.howSteps || [])
                .map((step) => {
                  const label = esc(I18n.t(step.labelKey));
                  if (step.url) {
                    return `<li><a href="${escAttr(step.url)}" target="_blank" rel="noopener noreferrer">${label}</a></li>`;
                  }
                  return `<li>${label}</li>`;
                })
                .join("");
              const hints = (check.caseHintKeys || [])
                .map((key) => `<p class="case-hint">${esc(I18n.t(key))}</p>`)
                .join("");
              return `
                <li class="art99-item ${isChecked(id) ? "is-done" : ""}">
                  <div class="art99-item-head">
                    <span class="art99-order">${check.order}</span>
                    <h4>${esc(I18n.t(check.titleKey))}</h4>
                  </div>
                  <p>${esc(I18n.t(check.whyKey))}</p>
                  <div class="art99-how">
                    <strong>${esc(I18n.t("art99.howLabel"))}</strong>
                    <ol>${how}</ol>
                  </div>
                  <p><strong>${esc(I18n.t("art99.evidenceLabel"))}</strong> ${esc(I18n.t(check.evidenceKey))}</p>
                  ${hints}
                  ${renderFactList(check.facts || [])}
                  <label class="check-row art99-pass">
                    <input type="checkbox" data-check-id="${escAttr(id)}" ${isChecked(id) ? "checked" : ""} />
                    <span>${esc(I18n.t("art99.passLabel"))}</span>
                  </label>
                </li>`;
            })
            .join("")}
        </ol>
      </section>
    `;
  },
};
