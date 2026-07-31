/**
 * Declarative step gates (advanceRequires on steps.json).
 */

function isCheckedId(progress, id) {
  return (progress.checkedItemIds || []).includes(id);
}

function panelForKey(panelsByKey, key) {
  return panelsByKey?.[key] || null;
}

/**
 * @returns {{ ok: boolean, unmet: Array<{ labelKey: string }> }}
 */
export function evaluateGates(requirements, ctx) {
  const unmet = [];
  const list = Array.isArray(requirements) ? requirements : [];
  const { progress, isChecked, panelsByKey } = ctx;

  for (const req of list) {
    if (!req || typeof req !== "object") continue;
    const labelKey = req.labelKey || "ui.cannotComplete";
    let ok = true;

    switch (req.type) {
      case "guidedComplete": {
        if (req.whenPath && progress.occupationPath !== req.whenPath) {
          ok = true;
          break;
        }
        const panel = panelForKey(panelsByKey, req.panel);
        if (!panel?.data) {
          ok = false;
          break;
        }
        ok = panel.allComplete(isChecked);
        break;
      }
      case "checklist": {
        const ids = req.ids || [];
        ok = ids.every((id) => isChecked(`core:${id}`) || isCheckedId(progress, `core:${id}`));
        break;
      }
      case "occupationSelected": {
        ok = Boolean(progress.selectedOccupationId);
        break;
      }
      case "occupationPathDecided": {
        if (progress.occupationPath === "labor_market_test") {
          ok = true;
        } else if (progress.occupationPath === "uv_skip_candidate") {
          ok = Boolean(progress.uvCandidate);
        } else {
          ok = false;
        }
        break;
      }
      case "stepComplete": {
        ok = (progress.completedStepIds || []).includes(req.stepId);
        break;
      }
      default:
        ok = false;
    }

    if (!ok) unmet.push({ labelKey, type: req.type });
  }

  return { ok: unmet.length === 0, unmet };
}

export function canMarkStepComplete(step, ctx) {
  return evaluateGates(step?.advanceRequires, ctx);
}

/**
 * Enter step at index only if every prior step is marked complete.
 * Step 0 is always enterable.
 */
export function canEnterStep(steps, index, progress) {
  if (index <= 0) return true;
  if (index >= steps.length) return false;
  const completed = new Set(progress.completedStepIds || []);
  for (let i = 0; i < index; i++) {
    if (!completed.has(steps[i].id)) return false;
  }
  return true;
}

export function firstBlockedReason(steps, index, progress) {
  if (canEnterStep(steps, index, progress)) return null;
  for (let i = 0; i < index; i++) {
    if (!(progress.completedStepIds || []).includes(steps[i].id)) {
      return steps[i];
    }
  }
  return null;
}
