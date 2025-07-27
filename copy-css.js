// copy-css.js
import { mkdirSync, copyFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = `${__dirname}/src/components/SmartDataGrid.css`;
const destDir = `${__dirname}/dist/types/components`;
const destPath = `${destDir}/SmartDataGrid.css`;

// Ensure destination directory exists
mkdirSync(destDir, { recursive: true });

// Copy file
copyFileSync(sourcePath, destPath);

console.log("✅ SmartDataGrid.css copied to dist/types/components");
