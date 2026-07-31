import { createGuidedPanel } from "./guided-checks.js";

export const StartWorkGuide = createGuidedPanel({
  url: "data/start-work-checks.json",
  idPrefix: "sw",
  panelDomId: "sw-guide-panel",
});
