import { createGuidedPanel } from "./guided-checks.js";

export const OccupationGuide = createGuidedPanel({
  url: "data/occupation-checks.json",
  idPrefix: "occGuide",
  panelDomId: "occ-guide-panel",
});
