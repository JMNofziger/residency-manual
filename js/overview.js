/** Visual workflow overview (home). */

import { I18n } from "./i18n.js";
import { canEnterStep } from "./step-gates.js";
import { Uncertainty } from "./uncertainty.js";

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

/**
 * @param {object} opts
 * @param {object[]} opts.steps
 * @param {object} opts.progress
 * @param {object} opts.caseData
 * @param {number} opts.stepIndex
 */
export function renderWorkflowOverview({ steps, progress, caseData, stepIndex }) {
  const completed = new Set(progress.completedStepIds || []);
  const path = progress.occupationPath || "labor_market_test";
  const uv = progress.uvCandidate;
  const current = steps[stepIndex];
  const caseTitle = caseData?.title || caseData?.id || "";
  const isUv = path === "uv_skip_candidate";
  const doneCount = completed.size;
  const total = steps.length;

  const nodes = steps.map((s, i) => {
    const done = completed.has(s.id);
    const locked = !canEnterStep(steps, i, progress);
    const active = i === stepIndex;
    let status = "upcoming";
    if (done) status = "done";
    else if (active) status = "current";
    else if (locked) status = "locked";
    return { step: s, index: i, status, locked, done, active };
  });

  const branchLabel = isUv
    ? I18n.th("overview.branchUv", { title: uv?.title || "—" })
    : I18n.th("overview.branchLmt");

  const positionText = current
    ? I18n.t("overview.positionAt", { step: I18n.t(current.titleKey), n: doneCount, total })
    : I18n.t("overview.notStarted");

  const nodeHtml = nodes
    .map((n) => {
      const title = I18n.t(n.step.titleKey);
      const disabled = n.locked ? "disabled" : "";
      const branchClass =
        n.step.id === "lmt" ? (isUv ? "is-inactive-branch" : "is-active-branch") : "";
      return `
        <li class="flow-node is-${n.status} ${branchClass}" style="--i:${n.index}">
          <button type="button" class="flow-node-btn" data-overview-step="${n.index}" ${disabled}
            aria-current="${n.active ? "step" : "false"}">
            <span class="flow-ord">${n.step.order}</span>
            <span class="flow-copy">
              <span class="flow-label">${esc(title)}</span>
              <span class="flow-status">${esc(I18n.t(`overview.status.${n.status}`))}</span>
            </span>
          </button>
        </li>`;
    })
    .join("");

  return `
    <section class="overview-home" id="overview-home">
      <div class="overview-hero">
        <p class="overview-brand">${esc(I18n.t("ui.title"))}</p>
        <p class="overview-kicker">${esc(I18n.t("overview.kicker"))}</p>
        <h2 class="overview-title">${esc(I18n.t("overview.title"))}</h2>
        <p class="overview-lead">${esc(I18n.t("overview.lead"))}</p>
        <dl class="overview-meta">
          <div>
            <dt>${esc(I18n.t("overview.caseLabel"))}</dt>
            <dd>${esc(caseTitle || I18n.t("overview.noCase"))}</dd>
          </div>
          <div>
            <dt>${esc(I18n.t("overview.positionLabel"))}</dt>
            <dd>${esc(positionText)}</dd>
          </div>
          <div>
            <dt>${esc(I18n.t("overview.branchLabel"))}</dt>
            <dd>${branchLabel}</dd>
          </div>
        </dl>
        <div class="overview-cta-row">
          <button type="button" class="btn primary" id="btn-enter-wizard">
            ${esc(
              I18n.t("overview.enterChecklist", {
                step: current ? I18n.t(current.titleKey) : "",
              })
            )}
          </button>
        </div>
      </div>

      <div class="flow-board" aria-label="${escAttr(I18n.t("overview.flowLabel"))}">
        <div class="flow-branch-banner ${isUv ? "is-uv" : "is-lmt"}">
          <p class="flow-branch-title">${esc(I18n.t("overview.branchTitle"))}</p>
          <p>${I18n.th("overview.branchLead")}</p>
          <div class="flow-branch-rails" aria-hidden="true">
            <span class="rail rail-lmt ${isUv ? "" : "is-on"}">${I18n.th("overview.railLmt")}</span>
            <span class="rail rail-uv ${isUv ? "is-on" : ""}">${I18n.th("overview.railUv")}</span>
          </div>
          <p class="muted flow-join">${esc(I18n.t("overview.joinLabel"))}</p>
        </div>
        <ol class="flow-nodes">
          ${nodeHtml}
        </ol>
        <div class="flow-legend">
          <span class="leg is-done">${esc(I18n.t("overview.status.done"))}</span>
          <span class="leg is-current">${esc(I18n.t("overview.status.current"))}</span>
          <span class="leg is-locked">${esc(I18n.t("overview.status.locked"))}</span>
          <span class="leg is-upcoming">${esc(I18n.t("overview.status.upcoming"))}</span>
        </div>
      </div>

      ${Uncertainty.renderOverview()}
    </section>`;
}
