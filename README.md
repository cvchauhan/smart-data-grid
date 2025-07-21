# 🔳 smart-data-grid

A lightweight, framework-agnostic, Web Component (Custom Element) for rendering smart data tables using just configuration — no manual HTML required.

✅ Works in **React**, **Angular**, **Vue**, **Next.js**, or **plain HTML**  
✅ Just pass your `data` and `header` as JSON  
✅ Supports filtering, pagination (coming soon)  
✅ Built with TypeScript

---

## 🚀 Installation

```bash
npm install smart-data-grid
```

---

## 🔧 Usage

### ➤ In React, Angular, Vue, or HTML

```ts
import 'smart-data-grid'; // Registers <smart-data-grid> globally
```

Then use it like this:

```html
<smart-data-grid
  data='[{"name":"Alice","age":25},{"name":"Bob","age":30}]'
  header='[{"key":"name","label":"Name"},{"key":"age","label":"Age"}]'
></smart-data-grid>
```

You can also programmatically set attributes:

```ts
const grid = document.getElementById('grid');
grid.setAttribute('data', JSON.stringify(data));
grid.setAttribute('header', JSON.stringify(header));
```

---

## ✨ Features

- ✅ Framework-agnostic Web Component
- ✅ Pass JSON `data` and `header`
- ✅ Auto-renders a table
- ✅ Shadow DOM encapsulation
- 🔜 Pagination (in development)
- 🔜 Column sorting/filtering (planned)

---

## 📦 Props

| Attribute | Type     | Description                      |
|----------|----------|----------------------------------|
| `data`   | string   | JSON stringified array of rows   |
| `header` | string   | JSON stringified array of column config (`{ key, label }`) |
| `pagination` | boolean (optional) | Enables pagination |
| `filter`     | boolean (optional) | Enables filter input |

---

## 📄 Example

```html
<smart-data-grid
  data='[
    { "first_name": "Alice", "last_name": "Wonderland" },
    { "first_name": "Bob", "last_name": "Builder" }
  ]'
  header='[
    { "key": "first_name", "label": "First Name" },
    { "key": "last_name", "label": "Last Name" }
  ]'
></smart-data-grid>
```

---

## 🌐 Browser/CDN

No npm? Use directly in HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/smart-data-grid/dist/smart-data-grid.umd.js"></script>
```

---

## 🧪 Demo

You can run a local test by creating an `index.html`:

```html
<script src="./dist/smart-data-grid.umd.js"></script>
<smart-data-grid
  data='[{"name":"Alice","age":25}]'
  header='[{"key":"name","label":"Name"},{"key":"age","label":"Age"}]'
></smart-data-grid>
```

Then serve it with:

```bash
npx serve .
```

---

## 📁 Source Code

https://github.com/your-username/smart-data-grid

---

## 📝 License

MIT © 2024 [Your Name]