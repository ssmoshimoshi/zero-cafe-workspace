# Zero Cafe Workspace - CHANGELOG

## [v105] - 2026-07-01
### Fixed
- **Critical Crash Fix**: Fixed a fatal ReferenceError that caused the Daily, Weekly, and Monthly pages to become unresponsive (blank screen). This was caused by missing `include` directives for the newly created partials in `index.html`. Added `Partial-Form-Daily`, `Partial-Form-Weekly`, `Partial-Form-Monthly`, and `Partial-Dashboard-GM` to `index.html` to restore application functionality.

## [v104] - 2026-07-01
### Fixed
- **Oversized SVG Minifier Bug**: Resolved a major UI bug where the "KEMBALI" button in the Daily Report form rendered as a gigantic, screen-filling SVG. The issue was traced to the Google Apps Script minifier incorrectly interpreting the `//` in `<svg xmlns="http://www.w3.org/2000/svg">` (inside a JS template literal) as a JavaScript comment, which stripped the closing `</svg>` tag. 
- **Applied Global SVG Fix**: Removed all `xmlns` attributes from SVGs and converted self-closing `<path/>` tags to explicitly closed `<path></path>` tags across all files (`JS-App1.html`, `JS-App2.html`, `Partial-*.html`, `index.html`).
- **Cleaned Duplicate Code**: Deleted 560+ lines of duplicate template code (`getDailyFormTemplate` and `getDailyTabContent`) from `JS-App1.html` to ensure the application correctly reads from `Partial-Form-Daily.html`.

## [v103] - 2026-07-01
### Changed
- Attempted to fix the oversize header button issue by adjusting CSS sizes on SVG elements. (Note: This fix failed to propagate to the Daily form because the app was still reading from duplicate code in `JS-App1.html`).

## [v102] - 2026-07-01
### Fixed
- **Supervisor Data Loss Bug**: Fixed a bug where the selected Supervisor name automatically disappeared when switching tabs inside the daily form, preventing the final report submission.

## [v101] - 2026-07-01
### Refactored
- Started splitting the massive UI code into separate partial files (`Partial-Form-Daily.html`, etc.) for better maintainability and organization.

---
*Note: This log is maintained by AI to track historical context and major deployment versions on the `AKfycbzmjpOPY34k7AQ4YTieRxRwnkGKsWsPH6-Xcl4bZK4nvNLRIAbOOKONRnMVFCE3ZjWf` deployment.*
