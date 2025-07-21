import { DataGridConfig } from "./types";

export class SmartDataGrid extends HTMLElement {
  config: DataGridConfig = { data: [], header: [] };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["data", "header", "pagination", "filter"];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const shadow = this.shadowRoot!;
    shadow.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const header = this.getAttribute("header");
    const data = this.getAttribute("data");

    let headerArray: any[] = [];
    let dataArray: any[] = [];

    try {
      if (header) headerArray = JSON.parse(header);
      if (data) dataArray = JSON.parse(data);
    } catch (e) {
      console.warn("Invalid data/header JSON");
    }

    headerArray.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h.label;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    dataArray.forEach((row) => {
      const tr = document.createElement("tr");
      headerArray.forEach((h) => {
        const td = document.createElement("td");
        td.textContent = row[h.key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    shadow.appendChild(table);
  }
}

customElements.define("smart-data-grid", SmartDataGrid);
