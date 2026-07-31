import { I18n } from "./i18n.js";

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

/** Glossary + offices reference (GOV.UK-style contact cards + definition list). */
export const Reference = {
  glossary: null,
  offices: null,
  mode: null, // "glossary" | "offices" | null
  focusId: null,
  query: "",

  async load() {
    const [glossary, offices] = await Promise.all([
      fetch("data/glossary.json").then((r) => {
        if (!r.ok) throw new Error("glossary");
        return r.json();
      }),
      fetch("data/offices.json").then((r) => {
        if (!r.ok) throw new Error("offices");
        return r.json();
      }),
    ]);
    this.glossary = glossary;
    this.offices = offices;
  },

  getOffice(id) {
    return (this.offices?.offices || []).find((o) => o.id === id) || null;
  },

  getTerm(id) {
    return (this.glossary?.terms || []).find((t) => t.id === id) || null;
  },

  open(mode, focusId = null) {
    this.mode = mode;
    this.focusId = focusId;
    this.query = "";
    this.mount();
  },

  close() {
    this.mode = null;
    this.focusId = null;
    if (this._onKeydown) {
      document.removeEventListener("keydown", this._onKeydown);
      this._onKeydown = null;
    }
    const host = document.getElementById("reference-drawer");
    if (host) host.hidden = true;
  },

  officesForStep(stepId) {
    return (this.offices?.offices || []).filter((o) => (o.stepIds || []).includes(stepId));
  },

  renderOfficeCard(office, { compact = false, showOpenInBook = false } = {}) {
    if (!office) return "";
    const phones = (office.phones || [])
      .map((p) => `<li><a href="tel:${escAttr(p)}">${esc(p)}</a></li>`)
      .join("");
    const emails = (office.emails || [])
      .map((e) => `<li><a href="mailto:${escAttr(e)}">${esc(e)}</a></li>`)
      .join("");
    return `
      <article class="office-card ${compact ? "is-compact" : ""}" id="office-${escAttr(office.id)}" data-office-id="${escAttr(
        office.id
      )}">
        <header class="office-card-head">
          <h3>${esc(I18n.t(office.nameKey))}</h3>
          ${
            showOpenInBook
              ? `<button type="button" class="btn ghost office-open-btn" data-open-office="${escAttr(
                  office.id
                )}">${esc(I18n.t("ui.openInAddressBook"))}</button>`
              : ""
          }
        </header>
        <p class="office-role">${esc(I18n.t(office.roleKey))}</p>
        ${office.address ? `<p class="office-address">${esc(office.address)}</p>` : ""}
        <p class="office-links">
          <a href="${escAttr(office.website)}" target="_blank" rel="noopener noreferrer">${esc(
            I18n.t(office.hubLabelKey || "ui.officialWebsite")
          )}</a>
        </p>
        ${phones || emails ? `<ul class="office-contacts">${phones}${emails}</ul>` : ""}
        <p class="muted office-verify">${esc(I18n.t(office.verifyKey || "offices.verifyOnSite"))}</p>
      </article>`;
  },

  renderStepOffices(stepId) {
    const list = this.officesForStep(stepId);
    if (!list.length) return "";
    return `
      <section class="card offices-inline" aria-labelledby="step-offices-heading">
        <div class="panel-head">
          <h3 id="step-offices-heading">${esc(I18n.t("ui.stepOffices"))}</h3>
          <button type="button" class="btn ghost" data-open-reference="offices">${esc(
            I18n.t("ui.addressBook")
          )}</button>
        </div>
        <p class="muted">${esc(I18n.t("ui.stepOfficesIntro"))}</p>
        <div class="office-card-grid">
          ${list.map((o) => this.renderOfficeCard(o, { compact: true })).join("")}
        </div>
      </section>`;
  },

  filteredTerms() {
    const q = this.query.trim().toLowerCase();
    const terms = [...(this.glossary?.terms || [])].sort((a, b) => a.sort.localeCompare(b.sort));
    if (!q) return terms;
    return terms.filter((t) => {
      const title = I18n.t(t.titleKey).toLowerCase();
      const body = I18n.t(t.bodyKey).toLowerCase();
      return title.includes(q) || body.includes(q) || t.id.includes(q) || t.sort.toLowerCase().includes(q);
    });
  },

  filteredOffices() {
    const q = this.query.trim().toLowerCase();
    const offices = [...(this.offices?.offices || [])].sort((a, b) => a.sort.localeCompare(b.sort));
    if (!q) return offices;
    return offices.filter((o) => {
      const name = I18n.t(o.nameKey).toLowerCase();
      const role = I18n.t(o.roleKey).toLowerCase();
      return name.includes(q) || role.includes(q) || o.id.includes(q);
    });
  },

  renderGlossaryBody() {
    const terms = this.filteredTerms();
    if (!terms.length) return `<p class="muted">${esc(I18n.t("ui.referenceEmpty"))}</p>`;
    return `
      <dl class="glossary-list">
        ${terms
          .map((t) => {
            const offices = (t.officeIds || [])
              .map((id) => this.getOffice(id))
              .filter(Boolean)
              .map(
                (o) =>
                  `<button type="button" class="term-office-link" data-open-office="${escAttr(o.id)}">${esc(
                    I18n.t(o.nameKey)
                  )}</button>`
              )
              .join(" ");
            return `
              <div class="glossary-item ${this.focusId === t.id ? "is-focus" : ""}" id="term-${escAttr(t.id)}">
                <dt>${esc(I18n.t(t.titleKey))}</dt>
                <dd>
                  <p>${esc(I18n.t(t.bodyKey))}</p>
                  ${offices ? `<p class="glossary-related">${esc(I18n.t("ui.relatedOffices"))}: ${offices}</p>` : ""}
                </dd>
              </div>`;
          })
          .join("")}
      </dl>`;
  },

  renderOfficesBody() {
    const offices = this.filteredOffices();
    if (!offices.length) return `<p class="muted">${esc(I18n.t("ui.referenceEmpty"))}</p>`;
    return `
      <p class="muted">${esc(I18n.t(this.offices.noteKey))}</p>
      <div class="office-card-grid">
        ${offices.map((o) => this.renderOfficeCard(o, { compact: false })).join("")}
      </div>`;
  },

  mount() {
    let host = document.getElementById("reference-drawer");
    if (!host) {
      host = document.createElement("div");
      host.id = "reference-drawer";
      host.className = "reference-drawer";
      document.body.appendChild(host);
    }
    if (!this.mode) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    const title =
      this.mode === "glossary" ? I18n.t("ui.glossary") : I18n.t("ui.addressBook");
    const body = this.mode === "glossary" ? this.renderGlossaryBody() : this.renderOfficesBody();
    host.innerHTML = `
      <div class="reference-backdrop" data-close-reference></div>
      <div class="reference-panel" role="dialog" aria-modal="true" aria-labelledby="reference-title">
        <header class="reference-head">
          <h2 id="reference-title">${esc(title)}</h2>
          <button type="button" class="btn ghost" data-close-reference>${esc(I18n.t("ui.close"))}</button>
        </header>
        <label class="reference-search">
          <span class="visually-hidden">${esc(I18n.t("ui.search"))}</span>
          <input type="search" id="reference-search-input" value="${escAttr(this.query)}" placeholder="${escAttr(
            I18n.t("ui.searchReference")
          )}" />
        </label>
        <div class="reference-body" id="reference-body">${body}</div>
      </div>`;

    host.querySelectorAll("[data-close-reference]").forEach((el) => {
      el.addEventListener("click", () => this.close());
    });
    host.querySelector("#reference-search-input")?.addEventListener("input", (e) => {
      this.query = e.target.value || "";
      const bodyEl = host.querySelector("#reference-body");
      if (bodyEl) {
        bodyEl.innerHTML = this.mode === "glossary" ? this.renderGlossaryBody() : this.renderOfficesBody();
        this.bindBody(host);
      }
    });
    this.bindBody(host);
    if (this._onKeydown) document.removeEventListener("keydown", this._onKeydown);
    this._onKeydown = (e) => {
      if (e.key === "Escape") this.close();
    };
    document.addEventListener("keydown", this._onKeydown);

    if (this.focusId) {
      const el =
        host.querySelector(`#term-${CSS.escape(this.focusId)}`) ||
        host.querySelector(`#office-${CSS.escape(this.focusId)}`);
      el?.scrollIntoView({ block: "nearest" });
    }
  },

  bindBody(host) {
    host.querySelectorAll("[data-open-office]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.open("offices", btn.getAttribute("data-open-office"));
      });
    });
  },

  /** Plain-language term chip that opens the glossary entry. */
  termChip(termId, label) {
    return `<button type="button" class="term-chip" data-open-term="${escAttr(termId)}">${esc(label)}</button>`;
  },
};
