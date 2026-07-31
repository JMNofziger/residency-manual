import { createGuidedPanel } from "./guided-checks.js";

export const ComplyGuide = createGuidedPanel({
  url: "data/comply-checks.json",
  idPrefix: "cy",
  panelDomId: "cy-guide-panel",
});
