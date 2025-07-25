import React from "react";
import { createRoot } from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import SmartDataGrid from "./components/SmartDataGrid";
import "bootstrap/dist/css/bootstrap.min.css";

// Wrap SmartDataGrid as Web Component
const SmartGridElement = reactToWebComponent(SmartDataGrid, React, {
  createRoot,
});

// Define it for browser
customElements.define("smart-data-grid", SmartGridElement);

// Optional: Export component for React use
export { SmartDataGrid };
