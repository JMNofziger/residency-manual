/** Load nationality pack and render slotted panels. */

import { I18n } from "./i18n.js";
import { renderFactList } from "./facts.js";

export const Nationality = {
  pack: null,
  localeStrings: null,

  async load(nationalityId) {
    const res = await fetch(`data/nationalities/${nationalityId}.json`);
    if (!rOk(res)) throw new Error(`nationality pack ${nationalityId}`);
    this.pack = await res.json();
    return this.pack;
  },

  chipLabel() {
    if (!this.pack) return "";
    return I18n.tp(this.pack.labelKey) || this.pack.id;
  },

  /**
   * @param {string} stepId
   * @param {(id: string) => boolean} isChecked
   * @param {(id: string, checked: boolean) => void} onToggle
   */
  renderSlot(stepId, isChecked, onToggle) {
    const slot = this.pack?.slots?.[stepId];
    if (!slot) return "";

    const title = slot.titleKey ? I18n.tp(slot.titleKey) : I18n.t("ui.nationalityPanel");
    const blurb = slot.blurbKey ? `<p class="slot-blurb">${esc(I18n.tp(slot.blurbKey))}</p>` : "";
    const notes = slot.notesKey ? `<p class="slot-notes">${esc(I18n.tp(slot.notesKey))}</p>` : "";
    const factsHtml = renderFactList(slot.facts || [], "ui.citedFacts", "pack");

    let checklistHtml = "";
    if (Array.isArray(slot.checklist) && slot.checklist.length) {
      checklistHtml = `<ul class="checklist nationality-checklist">${slot.checklist
        .map((item) => {
          const id = `nat:${this.pack.id}:${item.id}`;
          const checked = isChecked(id) ? "checked" : "";
          const help = item.helpKey ? `<p class="check-help">${esc(I18n.tp(item.helpKey))}</p>` : "";
          const itemFacts = renderFactList(item.facts || [], "ui.citedFacts", "pack");
          const links = (item.links || [])
            .map(
              (l) =>
                `<a class="inline-link" href="${escAttr(l.url)}" target="_blank" rel="noopener noreferrer">${esc(
                  I18n.tp(l.labelKey)
                )}</a>`
            )
            .join(" · ");
          return `
            <li>
              <label class="check-row">
                <input type="checkbox" data-check-id="${escAttr(id)}" ${checked} />
                <span>${esc(I18n.tp(item.labelKey))}</span>
              </label>
              ${help}
              ${links ? `<div class="check-links">${links}</div>` : ""}
              ${itemFacts}
            </li>`;
        })
        .join("")}</ul>`;
    }

    const slotLinks = (slot.links || [])
      .map(
        (l) =>
          `<li><a href="${escAttr(l.url)}" target="_blank" rel="noopener noreferrer">${esc(
            I18n.tp(l.labelKey)
          )}</a></li>`
      )
      .join("");

    // Wire toggle via event delegation in app; keep signature for API symmetry
    void onToggle;

    return `
      <aside class="nationality-panel" data-slot-step="${escAttr(stepId)}">
        <div class="nationality-panel-head">
          <span class="nat-badge">${esc(this.pack.flagEmoji || "")} ${esc(this.chipLabel())}</span>
          <h3>${esc(title)}</h3>
        </div>
        ${blurb}
        ${notes}
        ${factsHtml}
        ${checklistHtml}
        ${slotLinks ? `<ul class="source-list">${slotLinks}</ul>` : ""}
      </aside>
    `;
  },
};

function rOk(res) {
  return res && res.ok;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escAttr(s) {
  return esc(s).replaceAll("'", "&#39;");
}
