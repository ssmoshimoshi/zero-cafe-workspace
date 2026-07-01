---
name: gas-developer
description: >
  Expert skill for developing, debugging, and deploying Google Apps Script (GAS) web applications.
  Triggers when the user asks to: code/fix/debug the app, deploy or push changes, work on any HTML/JS/GAS files,
  investigate bugs, or perform any change related to the Zero Cafe Workspace project.
---

# Google Apps Script (GAS) Developer Skill

You are an expert GAS developer working on the **Zero Cafe Workspace** project. Every time you make any code change, you MUST follow this workflow completely.

---

## ⚙️ MANDATORY WORKFLOW (After Every Code Change)

Always execute these steps IN ORDER after finishing any code modification:

```bash
# Step 1 — Deploy to Google Apps Script (Live Production)
clasp push -f && clasp deploy -i AKfycbzmjpOPY34k7AQ4YTieRxRwnkGKsWsPH6-Xcl4bZK4nvNLRIAbOOKONRnMVFCE3ZjWf -d "Short description of change"

# Step 2 — Commit & Push to GitHub
git add . && git commit -m "type: short description" && git push origin main
```

**Never skip either step.**

---

## 🚨 CRITICAL RULES — READ BEFORE WRITING ANY CODE

### Rule 1: The GAS SVG Minifier Bug
When HTML files containing `<script>` tags are included by GAS, the minifier **breaks SVG elements** that use `xmlns` attributes inside JavaScript template literals.

**DO NOT write:**
```html
<svg xmlns="http://www.w3.org/2000/svg" ...><path d="..." /></svg>
```
The `//` in `http://` is parsed as a **JS comment**, stripping the rest of the line, including `</svg>`. This causes all subsequent HTML (like a "KEMBALI" button) to become part of the SVG, rendering as a gigantic full-screen element.

**ALWAYS write:**
```html
<svg width="14" height="14" viewBox="0 0 24 24" ...><path d="..."></path></svg>
```
✅ No `xmlns` attribute. ✅ Explicit closing tags `<path></path>`, not self-closing `<path />`.

---

### Rule 2: No Duplicate Template Functions
Each page template function (e.g., `getDailyFormTemplate`, `getWeeklyTabContent`) must exist in **exactly ONE file**.

| Function | Lives In |
|---|---|
| `getDailyFormTemplate`, `getDailyTabContent` | `Partial-Form-Daily.html` |
| `getWeeklyFormTemplate`, `getWeeklyTabContent` | `Partial-Form-Weekly.html` |
| `getMonthlyFormTemplate`, `getMonthlyTabContent` | `Partial-Form-Monthly.html` |
| `getDashboardGMTemplate` | `Partial-Dashboard-GM.html` |
| All helper functions | `JS-App2.html` |

**Never** leave duplicate functions in `JS-App1.html` or `JS-App2.html`.

---

### Rule 3: Always Update `index.html` When Adding New Files
If you create a **new** HTML file, you **MUST** add its include to `index.html` before `</body>`:
```html
<?!= include('YourNewFile'); ?>
```
Forgetting this causes `ReferenceError` and the entire app goes blank.

**Current correct include order in `index.html`:**
```html
<?!= include('CSS'); ?>
...
<?!= include('Partial-Form-Daily'); ?>
<?!= include('Partial-Form-Weekly'); ?>
<?!= include('Partial-Form-Monthly'); ?>
<?!= include('Partial-Dashboard-GM'); ?>
<?!= include('JS-API'); ?>
<?!= include('JS-App1'); ?>
<?!= include('JS-App2'); ?>
```

---

## 📁 File Structure Reference

| File | Purpose |
|---|---|
| `Code.gs` | Backend: `doGet`, API endpoints for Sheets/Drive |
| `index.html` | Entry point: loads all partials, sets up PWA |
| `CSS.html` | Tailwind config + custom CSS |
| `JS-API.html` | `google.script.run` wrappers |
| `JS-App1.html` | Core SPA logic: `AppState`, `renderApp`, login, SPV menu |
| `JS-App2.html` | Helper functions ONLY (no templates) |
| `Partial-Form-Daily.html` | Daily form HTML template + tab content |
| `Partial-Form-Weekly.html` | Weekly form HTML template + tab content |
| `Partial-Form-Monthly.html` | Monthly form HTML template + tab content |
| `Partial-Dashboard-GM.html` | GM Dashboard template |

---

## 🐛 Debugging GAS Apps

Since GAS apps run inside an iframe and there's no local server, debugging requires:

1. **Check browser console** for `ReferenceError` — this means a function is missing or not included.
2. **Check `index.html` includes** — a missing `include()` is the most common cause of blank pages.
3. **Check for duplicate functions** — JS will silently use whichever was defined last.
4. **Look for the SVG minifier bug** — if a button or element appears massively oversized, an SVG tag is unclosed.
5. **Deploy a new version** and hard-refresh the browser (Ctrl+Shift+R) to clear the iframe cache.

---

## 📝 CHANGELOG Maintenance
After every significant change, update `CHANGELOG.md` with:
```markdown
## [vXXX] - YYYY-MM-DD
### Fixed / Changed / Added
- Description of what changed and why.
```
