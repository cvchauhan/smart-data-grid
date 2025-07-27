import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SmartDataGridReact from "../components/SmartDataGrid";
import "@testing-library/jest-dom";

const sampleData = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
];

const sampleColumns = [
  { field: "id", header: "ID" },
  { field: "name", header: "Name" },
  { field: "age", header: "Age" },
];

describe("SmartDataGridReact", () => {
  test("renders with data and columns", () => {
    render(
      <SmartDataGridReact
        dataSource={sampleData}
        columns={sampleColumns}
        title="Test Grid"
        enableExport={true}
      />
    );

    expect(screen.getByText("Test Grid")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  test("search filters the rows", () => {
    render(
      <SmartDataGridReact
        dataSource={sampleData}
        columns={sampleColumns}
        searchable
      />
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("pagination works correctly", () => {
    const bigData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + (i % 10),
    }));

    render(
      <SmartDataGridReact
        dataSource={bigData}
        columns={sampleColumns}
        paginationOptions={[10]}
      />
    );

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("▶️"));

    expect(screen.queryByText("User 1")).not.toBeInTheDocument();
    expect(screen.getByText("User 11")).toBeInTheDocument();
  });

  test("export dropdown is rendered when enabled", () => {
    render(
      <SmartDataGridReact
        dataSource={sampleData}
        columns={sampleColumns}
        enableExport={true}
        exportFormats={["csv", "json", "excel"]}
      />
    );

    // Selects all comboboxes (dropdowns)
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThan(1); // should find both selects

    // Look for export-specific options
    expect(screen.getByText(/Export as CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as Excel/i)).toBeInTheDocument();
  });
});
