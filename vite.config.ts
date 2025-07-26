import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom/client"], // <--- critical!
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SmartDataGrid",
      fileName: "smart-data-grid",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom/client"], // <--- do NOT bundle these
      output: {
        globals: {
          react: "React",
          "react-dom/client": "ReactDOM",
        },
      },
    },
  },
});
