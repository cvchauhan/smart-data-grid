export class SmartDataGrid extends HTMLElement {
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
    const data = JSON.parse(this.getAttribute("data") || "[]");
    const header = JSON.parse(this.getAttribute("header") || "[]");

    const style = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        table {
          margin-top: 1rem;
        }
        .table-container {
          overflow-x: auto;
        }
      </style>
    `;

    const table = document.createElement("table");
    table.className = "table table-bordered table-hover table-sm";

    // Table Header
    table.innerHTML =
      '<thead class="table-light"><tr>' +
      header.map((h: any) => `<th>${h.label}</th>`).join("") +
      "</tr></thead>";

    // Table Body
    const body = data
      .map(
        (row: any) =>
          "<tr>" +
          header.map((h: any) => `<td>${row[h.key]}</td>`).join("") +
          "</tr>"
      )
      .join("");

    table.innerHTML += `<tbody>${body}</tbody>`;

    // Render inside Shadow DOM
    this.shadowRoot!.innerHTML = `${style}<div class="table-container"></div>`;
    this.shadowRoot!.querySelector(".table-container")!.appendChild(table);
  }
}

customElements.define("smart-data-grid", SmartDataGrid);
