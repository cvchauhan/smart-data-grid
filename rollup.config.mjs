import typescript from "rollup-plugin-typescript2";

export default {
  input: "index.ts",
  output: [
    {
      file: "dist/smart-data-grid.umd.js",
      format: "umd",
      name: "SmartDataGrid",
    },
    {
      file: "dist/smart-data-grid.es.js",
      format: "es",
    },
  ],
  plugins: [typescript()],
};
