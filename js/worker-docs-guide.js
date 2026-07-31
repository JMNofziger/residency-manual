import { createGuidedPanel } from "./guided-checks.js";

export const WorkerDocsGuide = createGuidedPanel({
  url: "data/worker-docs-checks.json",
  idPrefix: "wd",
  panelDomId: "wd-guide-panel",
});
