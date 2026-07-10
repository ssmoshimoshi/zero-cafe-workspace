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

### Rule 4: Stable File List — DO NOT MODIFY WITHOUT CONFIRMATION
The following files have passed user-confirmed stable checkpoints. **Do NOT modify them unless the user explicitly asks to change that specific file.** If a new feature requires touching a stable file, explain the risk and get confirmation first.

| File | Checkpoint | GAS Version |
|---|---|---|
| `Partial-Form-Daily.html` | Checkpoint 1 | v118 |
| `Partial-Form-Weekly.html` | Checkpoint 2 | v124 |

When a new checkpoint is reached, update this table and `references/stable-checkpoints.md`.

---

### Rule 5: Read-Before-Write
**Never edit a file you haven't read in the current session.** Before modifying any file:
1. Use `view_file` to read the relevant sections first
2. Understand what's already there
3. Then make targeted edits

This prevents "guessing" file contents and accidentally overwriting working code.

---

### Rule 6: One Task, One Deploy
Do not combine 4-5 unrelated features into a single editing session. For each user request:
1. If it contains multiple independent tasks, suggest breaking them into steps
2. Complete one task → verify → deploy → then move to the next
3. This reduces risk of cascading breakage

---

### Rule 7: Confirm Before Code
For medium-to-large tasks (anything that touches 2+ files or adds new logic):
1. Explain the plan in 3-5 bullet points
2. Wait for user confirmation
3. Then execute

For trivial fixes (typo, single-line change, style tweak): proceed directly.

---

### Rule 8: Smart Rejection
You are **allowed and encouraged** to push back on requests that:
- Risk breaking stable files without clear benefit
- Combine too many changes at once (suggest splitting)
- Duplicate existing functionality
- Contradict a previous user-confirmed decision

Always provide **data-based reasoning** when rejecting. Never reject without an alternative suggestion.

---

### Rule 9: Always Use `window.form` in Inline Handlers
In all `onchange`, `oninput`, `onclick` attributes inside template literals:
- ✅ `window.form.penjualan.target`
- ❌ `form.penjualan.target` (never leave it bare inside string interpolation; do not rely on local `let/const` variables inside string attributes because they won't exist when the user clicks).

---

### Rule 10: HtmlService Escaping Bug (Syntax Errors in HTML Partials)
Google Apps Script's `HtmlService.createHtmlOutputFromFile()` parses `<script>` blocks inside partials verbatim.
- **DO NOT** use unescaped backslashes before backticks (e.g. `\``) or before dollar signs (`\$`) inside Javascript template literals if they are inside an HTML partial. 
- Doing so will result in an invalid escape sequence when the browser interprets the HTML string, causing `Uncaught SyntaxError: Invalid or unexpected token`.
- This syntax error will kill the entire `<script>` block, causing functions inside it to become `undefined`.

---

### Rule 11: Silent Routing Fallbacks & Redeclaration (`let/const`)
- In `JS-App1.html`, the core `renderApp()` function is wrapped in a `try...catch` block.
- If a fatal Javascript error occurs during rendering (for example, re-declaring a `let` variable like `let summaryColor` in `Partial-Dashboard-GM.html`), the `catch` block will silently trap it and execute a **fallback route** (e.g., routing back to `select_report` or SPV Dashboard).
- **Debugging Tip:** If the user complains that "login GM goes to SPV", **DO NOT** assume the routing button is broken. Assume the `getDashboardGMTemplate()` crashed due to a syntax error and triggered the silent fallback. Always look for pure JS bugs first (like `let` redeclarations or undefined properties).

---

## 🎨 Brand Design Rules — Zero Cafe

### Color Palette
| Usage | Color | Hex |
|---|---|---|
| Primary (text, buttons) | Hitam Zero | `#171717` |
| Background | Putih Zero | `#f0efef` |
| Card background | Putih | `#FFFFFF` |
| Border/divider | Abu Zero | `#919191` |
| Label/secondary text | Abu | `#9CA3AF` |
| Success indicator | Hijau | `#16A34A` |
| Warning indicator | Kuning/Oranye | `#D97706` |
| Danger indicator | Merah | `#DC2626` |

### Forbidden
- ❌ Jangan gunakan warna merah untuk tombol aksi (tombol utama harus hitam/putih)
- ❌ Jangan gunakan warna di luar palet ini tanpa konfirmasi

### Mobile-First Checklist
Sebelum menambahkan komponen UI baru, pastikan:
- [ ] Touch target minimal 44x44px untuk tombol
- [ ] Font size minimal 14px untuk input field
- [ ] Jangan letakkan 2 kolom input kecil bersebelahan di layar < 375px tanpa konfirmasi
- [ ] Test responsive di browser DevTools (375px width)

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

## 📚 References & Examples
For detailed data schemas, API docs, and code patterns, read:
- `references/data-schema.md` — Structure of `window.form` and Google Sheets columns
- `references/api-reference.md` — All backend API functions with parameters and return values
- `references/stable-checkpoints.md` — Stable versions and rollback instructions
- `references/known-bugs.md` — Historical bugs and their solutions
- `examples/rupiah-input-pattern.md` — Proven pattern for Rupiah-formatted inputs
- `examples/new-api-endpoint.md` — How to add a new API endpoint end-to-end

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
