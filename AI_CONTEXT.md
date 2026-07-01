# AI Context: Zero Cafe Workspace

## Project Overview
Zero Cafe Workspace is a web application built entirely on **Google Apps Script (GAS)**. It serves as an internal tool for supervisors (SPV) and the General Manager (GM) to submit and review daily, weekly, and monthly reports.

## Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN in `CSS.html`), Google Material Icons / SVG icons.
- **Backend**: Google Apps Script (`Code.gs`).
- **Database**: Google Sheets (data storage) and Google Drive (for saving PDF reports).

## Architecture & File Structure
- `Code.gs`: Backend functions (`doGet`, API endpoints).
- `index.html`: The main entry point. It loads Tailwind, sets up the PWA manifest, and uses `<?!= include('...'); ?>` to inject all other HTML/JS files into the DOM.
- `CSS.html`: Custom styles and Tailwind configuration.
- `JS-API.html`: Handles communication between the frontend and GAS backend (`google.script.run`).
- `JS-App1.html`: Contains core logic, state management (`AppState`), login flow, SPV menu, and previously contained the Daily form template.
- `JS-App2.html`: Contains logic for Weekly, Monthly, and GM Dashboard, as well as global helper functions.
- `Partial-Form-Daily.html`, `Partial-Form-Weekly.html`, `Partial-Form-Monthly.html`, `Partial-Dashboard-GM.html`: These are newly created files meant to store the HTML string templates for each respective page.

## Recent Refactoring & Bugs Encountered
1. **The Oversized SVG Bug (GAS Minifier Bug)**:
   - **Symptom**: Buttons (like the "KEMBALI" button) in the header were suddenly rendering as gigantic, screen-filling SVGs.
   - **Root Cause**: In Google Apps Script, when an HTML file containing `<script>` tags is included, GAS attempts to minify the JS. If an SVG inside a JS template literal contains `xmlns="http://www.w3.org/2000/svg"`, the minifier treats `//www...` as a JavaScript comment and deletes the rest of the line, including the `</svg>` closing tag. This causes the browser to parse subsequent HTML elements (like the KEMBALI button) as part of the SVG.
   - **Fix Applied**: We removed all `xmlns` attributes from SVGs and converted self-closing tags (`<path/>`) to explicit tags (`<path></path>`) across the codebase.

2. **The Missing Includes & Duplicate Templates Bug**:
   - **Symptom**: The user reported that clicking on "Harian", "Mingguan", or "Bulanan" resulted in the pages not opening at all (blank or unresponsive).
   - **Root Cause**: During a refactoring phase, we moved the template functions (`getDailyFormTemplate`, etc.) into `Partial-` files. However, we forgot to delete the original duplicate functions from `JS-App1.html` and `JS-App2.html`. When we finally deleted `getDailyFormTemplate` from `JS-App1.html`, the app crashed because we also forgot to add `<?!= include('Partial-Form-Daily'); ?>` to `index.html`.
   - **Fix Applied**: We added the missing `include` statements to `index.html` (Version 105).

## Current Outstanding Issues (Next Steps for AI)
The user has reported that they are **still stuck in a loop and cannot properly access the pages** or the UI is still broken. The next AI should investigate the following:
1. **Duplicate Functions in `JS-App2.html`**: We successfully deleted the duplicate `getDailyFormTemplate` from `JS-App1.html`, BUT `JS-App2.html` still contains duplicates of `getWeeklyFormTemplate`, `getMonthlyFormTemplate`, and `getDashboardGMTemplate`. These duplicates are overriding the ones in the new `Partial-` files.
2. **Global Helper Functions**: `JS-App2.html` contains many global helper functions (e.g., `updateWeeklyStaff`, `addMonthlyStaffRow`, `submitReport`, `renderGMChart`). Do not accidentally delete these when removing the duplicate templates from `JS-App2.html`.
3. **Emulator / Console Testing**: The user explicitly requested to test the app to see the exact error. Please check for any JavaScript `ReferenceError` or minifier syntax errors that might still be preventing the pages from rendering correctly.

## Instructions for the Next AI
1. Read this `AI_CONTEXT.md` file.
2. Review `index.html` to ensure the `include` order is correct and valid.
3. Clean up the duplicate template functions in `JS-App2.html` while preserving the helper logic.
4. Verify that the app navigates correctly between Login -> SPV Menu -> Daily/Weekly/Monthly forms without JS errors.
