// src/index.ts
import React from "react";
import { createRoot } from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import SmartDataGrid from "./components/SmartDataGrid";
import "./SmartDataGrid.css"; // 👈 Ensures styles are bundled

// Export both versions
export { SmartDataGrid };

// Export types
export type { SmartDataGridProps, ColumnDefinition } from "./types";

// Web component registration (only when in browser)
if (typeof window !== "undefined" && typeof customElements !== "undefined") {
  const SmartGridElement = reactToWebComponent(SmartDataGrid, React, {
    createRoot,
  });

  if (!customElements.get("smart-data-grid")) {
    customElements.define("smart-data-grid", SmartGridElement);
  }
}
