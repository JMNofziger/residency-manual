import { I18n } from "./i18n.js";
import { Theme } from "./theme.js";
import { Nationality } from "./nationality.js";
import { renderFactList } from "./facts.js";
import { Art99 } from "./art99.js";
import { UvList } from "./uv-list.js";

const CASE_PATH = "cases/example-dool-us-manual-labor.json";
const DEFAULT_LOCALE = "en";

const state = {
  caseData: null,
  stepsData: null,
  occupations: null,
  stepIndex: 0,
  progress: null,
};

function storageKey() {
  return `residency-runbook:${state.caseData?.id || "default"}`;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) {
      return {
        completedStepIds: [],
        checkedItemIds: [],
        locale: localStorage.getItem("residency-runbook:locale") || DEFAULT_LOCALE,
        theme: Theme.get(),
        updatedAt: null,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      completedStepIds: [],
      checkedItemIds: [],
      locale: DEFAULT_LOCALE,
      theme: Theme.get(),
      updatedAt: null,
    };
  }
}

function saveProgress() {
  state.progress.updatedAt = new Date().toISOString();
  state.progress.theme = Theme.get();
  localStorage.setItem(storageKey(), JSON.stringify(state.progress));
  localStorage.setItem("residency-runbook:locale", state.progress.locale);
}

function isChecked(id) {
  return state.progress.checkedItemIds.includes(id);
}

function setChecked(id, checked) {
  const set = new Set(state.progress.checkedItemIds);
  if (checked) set.add(id);
  else set.delete(id);
  state.progress.checkedItemIds = [...set];
  if (String(id).startsWith("art99:")) {
    Art99.syncParentChecklist(isChecked, (parentId, parentChecked) => {
      const s = new Set(state.progress.checkedItemIds);
      if (parentChecked) s.add(parentId);
      else s.delete(parentId);
      state.progress.checkedItemIds = [...s];
    });
  }
  saveProgress();
}

function currentStep() {
  return state.stepsData.steps[state.stepIndex];
}

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

function formatEur(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(I18n.locale === "hr" ? "hr-HR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function renderEmployerCard() {
  const e = state.caseData.employer;
  return `
    <section class="card employer-card">
      <h3>${esc(I18n.t("ui.employer"))}</h3>
      <p class="employer-name">${esc(e.name)}</p>
      <dl class="meta-grid">
        <div><dt>${esc(I18n.t("ui.address"))}</dt><dd>${esc(e.address)}</dd></div>
        <div><dt>${esc(I18n.t("ui.oib"))}</dt><dd>${esc(e.oib)}</dd></div>
        <div><dt>${esc(I18n.t("ui.mb"))}</dt><dd>${esc(e.mb)}</dd></div>
        <div><dt>${esc(I18n.t("ui.nkd"))}</dt><dd>${esc(e.nkd2025)} · ${esc(e.nkd2025Label)}</dd></div>
        <div><dt>${esc(I18n.t("ui.representative"))}</dt><dd>${esc(e.representative)}</dd></div>
        <div><dt>${esc(I18n.t("ui.employeesApprox"))}</dt><dd>${esc(String(e.employeesApprox))}</dd></div>
        <div><dt>${esc(I18n.t("ui.revenueReported"))}</dt><dd>${esc(formatEur(e.revenue2025Eur))}</dd></div>
      </dl>
      <a class="inline-link" href="${escAttr(e.finaUrl)}" target="_blank" rel="noopener noreferrer">${esc(
        I18n.t("ui.fina")
      )}</a>
    </section>
  `;
}

function renderCaseRisks(stepId) {
  const flags = (state.caseData.riskFlags || []).filter((f) => (f.stepIds || []).includes(stepId));
  if (!flags.length) return "";
  return `
    <section class="card risk-card">
      <h3>${esc(I18n.t("ui.caseRisks"))}</h3>
      <ul class="risk-list">
        ${flags
          .map(
            (f) => `
          <li>
            <p>${esc(I18n.t(f.severityKey))}</p>
            ${renderFactList(f.facts || [])}
          </li>`
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderOccupations() {
  const nkd = state.caseData.employer.nkd2025;
  const block = state.occupations.byNkd?.[nkd];
  if (!block) return "";
  const suggested = new Set(state.caseData.suggestedOccupationIds || []);
  return `
    <section class="card occupations-card">
      <h3>${esc(I18n.t("ui.occupations"))}</h3>
      <p class="muted">${esc(I18n.t(block.noteKey))}</p>
      <ul class="occupation-list">
        ${block.occupations
          .map((occ) => {
            const primary = occ.primary || suggested.has(occ.id);
            const fit = I18n.t(`ui.defensibility.${occ.defensibility}`);
            return `
              <li class="${primary ? "is-primary" : ""}">
                <div class="occ-title">
                  ${esc(I18n.t(occ.titleKey))}
                  ${primary ? `<span class="pill">${esc(I18n.t("ui.primary"))}</span>` : ""}
                </div>
                <p>${esc(I18n.t(occ.blurbKey))}</p>
                <span class="occ-fit">${esc(I18n.t("ui.defensibility"))}: ${esc(fit)}</span>
              </li>`;
          })
          .join("")}
      </ul>
      <p class="muted">${esc(I18n.t(block.uvListReminderKey))}</p>
    </section>
  `;
}

function renderSections(step) {
  return (step.sections || [])
    .map((sec) => {
      return `
        <section class="content-section">
          <h3>${esc(I18n.t(sec.titleKey))}</h3>
          <p>${esc(I18n.t(sec.bodyKey))}</p>
          ${renderFactList(sec.facts || [])}
        </section>`;
    })
    .join("");
}

function renderChecklist(step) {
  const items = step.checklist || [];
  if (!items.length) return "";
  return `
    <section class="card checklist-card">
      <h3>${esc(I18n.t("ui.checklist"))}</h3>
      <ul class="checklist">
        ${items
          .map((item) => {
            const id = `core:${item.id}`;
            return `
              <li>
                <label class="check-row">
                  <input type="checkbox" data-check-id="${escAttr(id)}" ${isChecked(id) ? "checked" : ""} />
                  <span>${esc(I18n.t(item.labelKey))}</span>
                </label>
              </li>`;
          })
          .join("")}
      </ul>
    </section>
  `;
}

function renderSources(step) {
  const sources = step.sources || [];
  if (!sources.length) return "";
  return `
    <section class="card sources-card">
      <h3>${esc(I18n.t("ui.sources"))}</h3>
      <ul class="source-list">
        ${sources
          .map(
            (s) => `
          <li>
            <a href="${escAttr(s.url)}" target="_blank" rel="noopener noreferrer">${esc(I18n.t(s.labelKey))}</a>
            <span class="fact-tier">${esc(I18n.t("ui.tier", { n: s.tier }))}</span>
          </li>`
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderStepNav() {
  const steps = state.stepsData.steps;
  return steps
    .map((s, i) => {
      const done = state.progress.completedStepIds.includes(s.id);
      const active = i === state.stepIndex;
      return `
        <button type="button" class="step-nav-item ${active ? "is-active" : ""} ${done ? "is-done" : ""}"
          data-step-index="${i}" aria-current="${active ? "step" : "false"}">
          <span class="step-num">${s.order}</span>
          <span class="step-label">${esc(I18n.t(s.titleKey))}</span>
        </button>`;
    })
    .join("");
}

function renderMain() {
  const step = currentStep();
  const completed = state.progress.completedStepIds.includes(step.id);
  const slots = step.nationalitySlots || [];
  const nationalityHtml = slots.map((id) => Nationality.renderSlot(id, isChecked, setChecked)).join("");

  document.getElementById("step-nav").innerHTML = renderStepNav();
  document.getElementById("mobile-progress").textContent = `${I18n.t("ui.progress")}: ${step.order}/${
    state.stepsData.steps.length
  }`;

  document.getElementById("main-panel").innerHTML = `
    <header class="step-header">
      <p class="eyebrow">${esc(I18n.t("ui.pathLmt"))}</p>
      <h2>${esc(I18n.t(step.titleKey))}</h2>
      <p class="step-summary">${esc(I18n.t(step.summaryKey))}</p>
    </header>
    ${step.showEmployerCard ? renderEmployerCard() : ""}
    ${step.showCaseRisks ? renderCaseRisks(step.id) : ""}
    ${renderSections(step)}
    ${step.showArt99Checks ? Art99.render(isChecked) : ""}
    ${step.showUvList ? UvList.render(state.caseData) : ""}
    ${step.showOccupations ? renderOccupations() : ""}
    ${nationalityHtml}
    ${renderChecklist(step)}
    ${renderSources(step)}
    <footer class="step-actions">
      <button type="button" class="btn ghost" id="btn-prev" ${state.stepIndex === 0 ? "disabled" : ""}>${esc(
        I18n.t("ui.prev")
      )}</button>
      <button type="button" class="btn ${completed ? "done" : "accent"}" id="btn-complete">
        ${esc(completed ? I18n.t("ui.stepComplete") : I18n.t("ui.markComplete"))}
      </button>
      <button type="button" class="btn primary" id="btn-next" ${
        state.stepIndex >= state.stepsData.steps.length - 1 ? "disabled" : ""
      }>${esc(I18n.t("ui.next"))}</button>
    </footer>
  `;

  if (step.showUvList) {
    UvList.afterMount(document.getElementById("uv-panel"), state.caseData);
  }

  document.getElementById("btn-prev")?.addEventListener("click", () => {
    state.stepIndex = Math.max(0, state.stepIndex - 1);
    render();
  });
  document.getElementById("btn-next")?.addEventListener("click", () => {
    state.stepIndex = Math.min(state.stepsData.steps.length - 1, state.stepIndex + 1);
    render();
  });
  document.getElementById("btn-complete")?.addEventListener("click", () => {
    const set = new Set(state.progress.completedStepIds);
    if (set.has(step.id)) set.delete(step.id);
    else set.add(step.id);
    state.progress.completedStepIds = [...set];
    saveProgress();
    render();
  });
}

function renderChrome() {
  document.getElementById("app-title").textContent = I18n.t("ui.title");
  document.getElementById("app-subtitle").textContent = I18n.t("ui.subtitle");
  document.getElementById("btn-lang-en").textContent = I18n.t("ui.langEn");
  document.getElementById("btn-lang-hr").textContent = I18n.t("ui.langHr");
  document.getElementById("btn-theme").textContent =
    Theme.get() === "dark" ? I18n.t("ui.themeLight") : I18n.t("ui.themeDark");
  document.getElementById("btn-reset").textContent = I18n.t("ui.reset");
  document.getElementById("nationality-chip").textContent = `${I18n.t("ui.nationality")}: ${Nationality.chipLabel()}`;
  document.getElementById("footer-disclaimer").textContent = I18n.t("ui.disclaimer");
  document.getElementById("footer-sources-link").textContent = I18n.t("ui.sourceRegistry");
  document.getElementById("nav-heading").textContent = I18n.t("ui.steps");
  const mobileNav = document.getElementById("btn-mobile-nav");
  if (mobileNav) mobileNav.textContent = I18n.t("ui.mobileMenu");
  document.getElementById("btn-lang-en").classList.toggle("is-active", state.progress.locale === "en");
  document.getElementById("btn-lang-hr").classList.toggle("is-active", state.progress.locale === "hr");
}

function render() {
  renderChrome();
  renderMain();
}

async function setLocale(locale) {
  state.progress.locale = locale;
  await I18n.load(locale, state.caseData.worker.nationalityId);
  saveProgress();
  render();
}

function bindGlobal() {
  document.getElementById("btn-lang-en").addEventListener("click", () => setLocale("en"));
  document.getElementById("btn-lang-hr").addEventListener("click", () => setLocale("hr"));
  document.getElementById("btn-theme").addEventListener("click", () => {
    Theme.toggle();
    saveProgress();
    renderChrome();
  });
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (!confirm(I18n.t("ui.resetConfirm"))) return;
    state.progress.completedStepIds = [];
    state.progress.checkedItemIds = [];
    saveProgress();
    render();
  });
  document.getElementById("step-nav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step-index]");
    if (!btn) return;
    state.stepIndex = Number(btn.dataset.stepIndex);
    render();
  });
  document.getElementById("main-panel").addEventListener("change", (e) => {
    const input = e.target;
    if (input?.matches?.('input[type="checkbox"][data-check-id]')) {
      setChecked(input.dataset.checkId, input.checked);
      if (String(input.dataset.checkId).startsWith("art99:")) {
        const parent = document.querySelector(
          `input[data-check-id="core:${Art99.data?.parentChecklistId}"]`
        );
        if (parent) parent.checked = Art99.allComplete(isChecked);
        const item = input.closest(".art99-item");
        if (item) item.classList.toggle("is-done", input.checked);
        const progress = document.querySelector("#art99-panel .pill");
        if (progress && Art99.data) {
          const total = Art99.data.checks.length;
          const done = Art99.checkIds().filter((id) => isChecked(id)).length;
          progress.textContent = I18n.t("art99.progress", { done, total });
        }
      }
    }
  });
  document.getElementById("btn-mobile-nav")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("is-open");
  });
}

async function init() {
  Theme.init();
  const loading = document.getElementById("loading-state");
  try {
    const [caseData, stepsData, occupations] = await Promise.all([
      fetch(CASE_PATH).then((r) => r.json()),
      fetch("data/steps.json").then((r) => r.json()),
      fetch("data/occupations.json").then((r) => r.json()),
      Art99.load(),
      UvList.load(),
    ]);
    state.caseData = caseData;
    state.stepsData = stepsData;
    state.occupations = occupations;
    state.progress = loadProgress();
    Theme.apply(state.progress.theme || Theme.get());
    await Nationality.load(caseData.worker.nationalityId);
    await I18n.load(state.progress.locale || DEFAULT_LOCALE, caseData.worker.nationalityId);
    Art99.syncParentChecklist(isChecked, setChecked);
    bindGlobal();
    loading.hidden = true;
    document.getElementById("app-shell").hidden = false;
    render();
  } catch (err) {
    console.error(err);
    loading.textContent = I18n.core?.ui?.errorLoad || "Could not load wizard data. Serve over HTTP (see README).";
  }
}

init();
