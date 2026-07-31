/** Render structured cited fact objects. */

import { I18n } from "./i18n.js";

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
 * @param {object[]} facts
 * @param {string} [headingKey]
 * @param {"core"|"pack"} [scope]
 * @returns {string} HTML
 */
export function renderFactList(facts, headingKey = "ui.citedFacts", scope = "core") {
  if (!Array.isArray(facts) || facts.length === 0) return "";
  return `
    <div class="fact-block" role="group" aria-label="${escapeAttr(I18n.t(headingKey))}">
      <h4 class="fact-block-title">${escapeHtml(I18n.t(headingKey))}</h4>
      <ul class="fact-list">
        ${facts.map((f) => renderFact(f, scope)).join("")}
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
