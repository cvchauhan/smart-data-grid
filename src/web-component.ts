
import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import SmartDataGrid from "./components/SmartDataGrid";

const WebSmartDataGrid = reactToWebComponent(
  SmartDataGrid,
  React,
  ReactDOM
);

customElements.define("smart-data-grid", WebSmartDataGrid);

export default WebSmartDataGrid;
