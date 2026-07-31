/** Cited fact objects + canonical catalog resolution. */

import { I18n } from "./i18n.js";

/** @type {Record<string, object>|null} */
let catalogFacts = null;

/**
 * Shared fee/deadline catalog (`data/facts-catalog.json`).
 * Contested alternate readings stay in `uncertainty.json`.
 */
export const FactsCatalog = {
  async load() {
    const res = await fetch("data/facts-catalog.json");
    if (!res.ok) throw new Error("Failed to load facts catalog");
    const data = await res.json();
    catalogFacts = data.facts && typeof data.facts === "object" ? data.facts : {};
    return catalogFacts;
  },

  /** @param {string} id */
  get(id) {
    if (!catalogFacts || !id || !catalogFacts[id]) return null;
    return { id, ...catalogFacts[id] };
  },

  /**
   * Resolve a facts[] list: string ids → catalog objects; inline objects pass through.
   * @param {unknown[]} list
   * @returns {object[]}
   */
  resolve(list) {
    if (!Array.isArray(list)) return [];
    return list.map((item, i) => {
      if (typeof item === "string") {
        const fact = this.get(item);
        if (!fact) {
          throw new Error(`Unknown facts-catalog id "${item}" at facts[${i}]`);
        }
        return fact;
      }
      if (item && typeof item === "object" && typeof item.ref === "string") {
        const fact = this.get(item.ref);
        if (!fact) {
          throw new Error(`Unknown facts-catalog id "${item.ref}" at facts[${i}]`);
        }
        return { ...fact, ...item, id: item.ref };
      }
      return item;
    });
  },
};

/**
 * @param {object} fact
 * @param {"core"|"pack"} [scope]
 * @returns {string} HTML
 */
export function renderFact(fact, scope = "core") {
  if (!fact || typeof fact !== "object") return "";
  let label = scope === "pack" ? I18n.tp(fact.labelKey) : I18n.t(fact.labelKey);
  if (scope === "pack" && label === fact.labelKey) label = I18n.t(fact.labelKey);
  const source = fact.sourceName || fact.sourceUrl || "";
  const citation = I18n.t("ui.factCitation", {
    value: fact.value,
    source,
    date: fact.verifiedDate,
  });
  const tier = I18n.t("ui.tier", { n: fact.sourceTier });
  const safeUrl = escapeAttr(fact.sourceUrl || "#");
  return `
    <li class="fact-item" data-fact-id="${escapeAttr(fact.id || "")}">
      <div class="fact-label">${escapeHtml(label)}</div>
      <a class="fact-citation" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(citation)}
      </a>
      <span class="fact-tier">${escapeHtml(tier)}</span>
    </li>
  `;
}

/**
 * @param {Array<object|string>} facts
 * @param {string} [headingKey]
 * @param {"core"|"pack"} [scope]
 * @returns {string} HTML
 */
export function renderFactList(facts, headingKey = "ui.citedFacts", scope = "core") {
  if (!Array.isArray(facts) || facts.length === 0) return "";
  const resolved = FactsCatalog.resolve(facts);
  return `
    <div class="fact-block" role="group" aria-label="${escapeAttr(I18n.t(headingKey))}">
      <h4 class="fact-block-title">${escapeHtml(I18n.t(headingKey))}</h4>
      <ul class="fact-list">
        ${resolved.map((f) => renderFact(f, scope)).join("")}
      </ul>
    </div>
  `;
}

export function collectFactsFromTree(node, acc = []) {
  if (!node || typeof node !== "object") return acc;
  if (
    Object.prototype.hasOwnProperty.call(node, "value") &&
    Object.prototype.hasOwnProperty.call(node, "sourceUrl") &&
    Object.prototype.hasOwnProperty.call(node, "sourceTier") &&
    Object.prototype.hasOwnProperty.call(node, "verifiedDate")
  ) {
    acc.push(node);
  }
  if (Array.isArray(node)) {
    for (const item of node) collectFactsFromTree(item, acc);
  } else {
    for (const val of Object.values(node)) collectFactsFromTree(val, acc);
  }
  return acc;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("'", "&#39;");
}
