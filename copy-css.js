// copy-css.js
import { mkdirSync, copyFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = `${__dirname}/src/components/SmartDataGrid.css`;
const destDir = `${__dirname}/dist/types/components`;
const destDirjs = `${__dirname}/dist/components`;
const destPath = `${destDir}/SmartDataGrid.css`;
const destPathjs = `${destDirjs}/SmartDataGrid.css`;

// Ensure destination directory exists
mkdirSync(destDir, { recursive: true });

// Copy file
copyFileSync(sourcePath, destPath);
copyFileSync(sourcePath, destPathjs);

console.log("✅ SmartDataGrid.css copied to dist/types/components");
