declare module "react-to-webcomponent" {
  import React from "react";
  import ReactDOM from "react-dom/client";

  const reactToWebComponent: (
    Component: React.ComponentType<any>,
    React: typeof React,
    ReactDOM: typeof ReactDOM
  ) => CustomElementConstructor;

  export default reactToWebComponent;
}
