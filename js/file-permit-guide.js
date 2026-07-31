import { createGuidedPanel } from "./guided-checks.js";

export const FilePermitGuide = createGuidedPanel({
  url: "data/file-permit-checks.json",
  idPrefix: "fp",
  panelDomId: "fp-guide-panel",
});
