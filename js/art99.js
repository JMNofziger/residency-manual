import { createGuidedPanel } from "./guided-checks.js";

/** Art. 99 panel — idPrefix "art99" must stay stable for localStorage. */
export const Art99 = createGuidedPanel({
  url: "data/art99-checks.json",
  idPrefix: "art99",
  panelDomId: "art99-panel",
});
