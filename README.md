# smart-data-grid

A powerful, feature-rich data grid library that works across all modern frameworks. Built with performance and flexibility in mind.

## ✨ Features

- 🔍 **Global Search** - Search across all columns with real-time filtering
- 📊 **Column Sorting** - Click headers to sort ascending/descending, click again to remove sort
- 📄 **Smart Pagination** - Configurable page sizes with intuitive navigation
- ✅ **Row Selection** - Single/multi-row selection with "Select All" functionality
- 📤 **Data Export** - Export data to CSV, JSON, or Excel formats (all data or selected rows)
- 🎨 **Theming** - Multiple built-in themes (modern, classic, dark)
- 🔗 **Action Columns** - Button and link columns with custom click handlers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **High Performance** - Optimized rendering for large datasets
- 🌐 **Framework Agnostic** - Works with React, Angular, Vue, and vanilla JavaScript
- 🎯 **TypeScript Support** - Full type definitions included

---

## 📦 Installation

```bash
npm install smart-data-grid
```

Or use via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/smart-data-grid/dist/smart-data-grid.umd.js"></script>
```

---

## 🚀 Quick Start

### React Example

```tsx
import React, { useState } from "react";
import SmartDataGrid from "smart-data-grid/react";

const MyComponent = () => {
  const data = [
    {
      id: 1,
      name: "Alice",
      age: 25,
      email: "alice@example.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob",
      age: 30,
      email: "bob@example.com",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Charlie",
      age: 35,
      email: "charlie@example.com",
      status: "Active",
    },
  ];

  const columns = [
    { field: "name", header: "Name" },
    { field: "age", header: "Age" },
    { field: "email", header: "Email" },
    {
      field: "status",
      header: "Status",
      type: "button",
      clickFn: (row) => console.log("Status clicked:", row),
    },
    {
      field: "actions",
      header: "Actions",
      type: "link",
      clickFn: (row) => console.log("Edit:", row),
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <SmartDataGrid
      dataSource={data}
      columns={columns}
      title="User Management"
      enableSelection={true}
      onSelectionChange={setSelectedRows}
      defaultSortKey="name"
      theme="modern"
      searchable={true}
      paginationOptions={[5, 10, 25, 50]}
      enableExport={true}
      exportFormats={["csv", "json", "excel"]}
      exportFileName="user-data"
    />
  );
};
```

### Web Component Example

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/smart-data-grid/dist/smart-data-grid.umd.js"></script>
  </head>
  <body>
    <smart-data-grid
      id="myGrid"
      data='[
      {"name":"Alice","age":25,"email":"alice@example.com"},
      {"name":"Bob","age":30,"email":"bob@example.com"}
    ]'
      header='[
      {"key":"name","label":"Name"},
      {"key":"age","label":"Age"},
      {"key":"email","label":"Email"}
    ]'
      pagination="true"
      filter="true"
      theme="modern"
    ></smart-data-grid>
  </body>
</html>
```

---

## 📋 Props & Configuration

### React Component Props

| Prop                | Type                              | Default                 | Description                      |
| ------------------- | --------------------------------- | ----------------------- | -------------------------------- |
| `dataSource`        | `Array<any>`                      | `[]`                    | Array of data objects to display |
| `columns`           | `ColumnConfig[]`                  | `[]`                    | Column configuration array       |
| `title`             | `string`                          | `undefined`             | Grid title displayed at the top  |
| `enableSelection`   | `boolean`                         | `false`                 | Enable row selection checkboxes  |
| `onSelectionChange` | `(rows: any[]) => void`           | `undefined`             | Callback when selection changes  |
| `defaultSortKey`    | `string`                          | `undefined`             | Initial column to sort by        |
| `theme`             | `'modern' \| 'classic' \| 'dark'` | `'modern'`              | Visual theme                     |
| `searchable`        | `boolean`                         | `true`                  | Show global search input         |
| `paginationOptions` | `number[]`                        | `[10, 20, 30, 50, 100]` | Available page size options      |
| `enableExport`      | `boolean`                         | `false`                 | Enable data export functionality |
| `exportFormats`     | `('csv' \| 'json' \| 'excel')[]`  | `['csv', 'json']`       | Available export formats         |
| `exportFileName`    | `string`                          | `'data-export'`         | Base filename for exported files |

### Column Configuration

```typescript
interface ColumnConfig {
  field: string; // Data field key
  header: string; // Column header text
  type?: "text" | "button" | "link"; // Column type
  clickFn?: (row: any) => void; // Click handler for button/link types
  showLinkConditions?: (row: any) => boolean; // Conditional display logic
}
```

### Web Component Attributes

| Attribute          | Type      | Description                                       |
| ------------------ | --------- | ------------------------------------------------- |
| `data`             | `string`  | JSON stringified array of data                    |
| `header`           | `string`  | JSON stringified column configuration             |
| `pagination`       | `boolean` | Enable pagination                                 |
| `filter`           | `boolean` | Enable global search                              |
| `theme`            | `string`  | Theme name ('modern', 'classic', 'dark')          |
| `page-size`        | `number`  | Default page size                                 |
| `enable-selection` | `boolean` | Enable row selection                              |
| `enable-export`    | `boolean` | Enable data export functionality                  |
| `export-formats`   | `string`  | Comma-separated export formats ('csv,json,excel') |

---

## 🎨 Themes

### Available Themes

- **Modern** - Clean, contemporary design with subtle shadows
- **Classic** - Traditional table styling with borders
- **Dark** - Dark mode optimized theme

### Custom Styling

```css
/* Override CSS custom properties */
.smart-data-grid.modern {
  --grid-bg: #ffffff;
  --grid-border: #e1e5e9;
  --header-bg: #f8f9fa;
  --row-hover: #f5f5f5;
  --primary-color: #007bff;
  --text-color: #212529;
}

.smart-data-grid.dark {
  --grid-bg: #1a1a1a;
  --grid-border: #404040;
  --header-bg: #2d2d2d;
  --row-hover: #333333;
  --primary-color: #4dabf7;
  --text-color: #ffffff;
}
```

---

## 🔧 Advanced Usage

### Data Export

The grid supports exporting data in multiple formats:

```typescript
// Export all filtered data or just selected rows
<SmartDataGrid
  dataSource={data}
  columns={columns}
  enableExport={true}
  exportFormats={["csv", "json", "excel"]}
  exportFileName="my-data"
/>
```

**Export Behavior:**

- If rows are selected, only selected rows are exported
- If no rows are selected, all filtered/sorted data is exported
- Action columns (buttons/links) are automatically excluded from exports
- Files are downloaded with timestamps to prevent overwrites

**Supported Formats:**

- **CSV** - Comma-separated values, Excel compatible
- **JSON** - Structured JSON format
- **Excel** - .xls format that opens in Microsoft Excel

### Programmatic Export

```typescript
// Access the grid ref to trigger exports programmatically
const gridRef = useRef();

const exportData = (format) => {
  gridRef.current?.exportData(format);
};

// Usage
<button onClick={() => exportData("csv")}>Export CSV</button>;
```

### Programmatic Control

```javascript
// Web Component
const grid = document.getElementById("myGrid");

// Update data
grid.setAttribute("data", JSON.stringify(newData));

// Change theme
grid.setAttribute("theme", "dark");

// Listen for events
grid.addEventListener("selectionChange", (event) => {
  console.log("Selected rows:", event.detail);
});
```

### Action Columns

```typescript
const columns = [
  { field: "name", header: "Name" },
  {
    field: "edit",
    header: "Actions",
    type: "button",
    clickFn: (row) => {
      // Handle edit action
      openEditModal(row);
    },
  },
  {
    field: "view",
    header: "View",
    type: "link",
    clickFn: (row) => {
      // Handle view action
      navigateToDetails(row.id);
    },
    showLinkConditions: (row) => row.status === "Active",
  },
];
```

### Selection Handling

```typescript
const handleSelectionChange = (selectedRows) => {
  console.log(`${selectedRows.length} rows selected`);

  // Bulk operations
  if (selectedRows.length > 1) {
    showBulkActions();
  }

  // Update UI state
  setCanDelete(selectedRows.length > 0);
};
```

---

## 📊 Performance

- **Efficient Rendering** - Only renders visible rows
- **Optimized Sorting** - Uses efficient comparison algorithms
- **Memory Management** - Minimal memory footprint
- **Debounced Search** - Prevents excessive filtering during typing
- **Virtual Scrolling** - Coming in v2.0 for ultra-large datasets

---

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

---

## 🔄 Migration Guide

### From v1.x to v2.x

```typescript
// Old API
<SmartDataGrid
  data={data}
  headers={headers}
  showPagination={true}
/>

// New API
<SmartDataGrid
  dataSource={data}
  columns={columns}
  paginationOptions={[10, 25, 50]}
/>
```

---

## 🧪 Examples

### Basic Table

```html
<smart-data-grid
  data='[{"name":"John","age":30},{"name":"Jane","age":25}]'
  header='[{"key":"name","label":"Full Name"},{"key":"age","label":"Age"}]'
></smart-data-grid>
```

### With Search and Pagination

```html
<smart-data-grid
  data="[...]"
  header="[...]"
  filter="true"
  pagination="true"
  theme="modern"
  page-size="25"
  enable-export="true"
  export-formats="csv,json,excel"
></smart-data-grid>
```

### React with Selection

```tsx
<SmartDataGrid
  dataSource={employees}
  columns={employeeColumns}
  title="Employee Directory"
  enableSelection={true}
  onSelectionChange={handleSelection}
  theme="dark"
  searchable={true}
  enableExport={true}
  exportFormats={["csv", "excel"]}
  exportFileName="employees"
/>
```

---

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/cvchauhan/smart-data-grid.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## 📝 Changelog

### v2.2.0 (Latest)

- ✅ Added comprehensive data export functionality
- ✅ Support for CSV, JSON, and Excel export formats
- ✅ Smart export (selected rows or all data)
- ✅ Automatic exclusion of action columns from exports
- ✅ Customizable export filenames

### v2.1.0

- ✅ Fixed "Select All" to work across all pages
- ✅ Added indeterminate checkbox states
- ✅ Improved row selection persistence
- ✅ Enhanced visual feedback for selections

### v2.0.0

- ✅ Complete rewrite with modern architecture
- ✅ Added React component support
- ✅ Multi-theme support
- ✅ Advanced column types (button, link)
- ✅ Improved accessibility
- ✅ TypeScript definitions

### v1.x

- ✅ Basic data grid functionality
- ✅ Web Component implementation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © 2025 Chirag Chauhan

---

## 🔗 Links

- **GitHub Repository**: https://github.com/cvchauhan/smart-data-grid
- **NPM Package**: https://www.npmjs.com/package/smart-data-grid
- **Issues**: https://github.com/cvchauhan/smart-data-grid/issues

---

## 💡 Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation

For support, email chiragvchauhan93@gmail.com or create an issue on GitHub.
