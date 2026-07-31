import { createGuidedPanel } from "./guided-checks.js";

export const EmployerPackage = createGuidedPanel({
  url: "data/employer-package-checks.json",
  idPrefix: "pkg",
  panelDomId: "pkg-panel",
});
