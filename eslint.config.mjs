import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";


export default defineConfig([
  globalIgnores([
    /*
     * Next.js
     */
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    /*
     * Dependencies
     */
    "node_modules/**",

    /*
     * Django / Python
     */
    "backend/.venv/**",
    "backend/venv/**",
    "backend/env/**",

    /*
     * Python generated files
     */
    "backend/**/__pycache__/**",
    "backend/**/*.pyc",

    /*
     * Django generated/static/media
     */
    "backend/staticfiles/**",
    "backend/media/**",

    /*
     * Reports
     */
    "coverage/**",
  ]),

  ...nextVitals,
  ...nextTs,
]);