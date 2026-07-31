import { createGuidedPanel } from "./guided-checks.js";

export const LmtGuide = createGuidedPanel({
  url: "data/lmt-checks.json",
  idPrefix: "lmtGuide",
  panelDomId: "lmt-guide-panel",
});
