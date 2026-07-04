import re

with open('Partial-Form-Daily.html', 'r') as f:
    content = f.read()

# Make the top tabs unclickable to enforce guided flow
content = content.replace('onclick="switchTab(${t.num})"', '')
content = content.replace('hover:bg-gray-200/50', '')

# Replace the cases with animated wrappers and buttons
def get_nav_buttons(case_num):
    buttons = '<div class="mt-8 flex gap-3">'
    if case_num > 1:
        buttons += f'<button type="button" onclick="window.switchTabLast = AppState.currentTab; AppState.currentTab = {case_num-1}; renderApp()" class="flex-1 py-3 border-2 border-zero-black rounded-sm text-xs font-bold text-zero-black hover:bg-gray-50 transition-all text-center">KEMBALI</button>'
    if case_num < 8:
        buttons += f'<button type="button" onclick="window.switchTabLast = AppState.currentTab; AppState.currentTab = {case_num+1}; renderApp()" class="flex-1 py-3 bg-zero-black rounded-sm text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition-all text-center">LANJUT</button>'
    buttons += '</div>'
    return buttons

for i in range(1, 9):
    # Find the case block start
    case_str = f"case {i}:\n            return `" if i == 1 else f"case {i}:\n      return `"
    # Find the end of the template string
    # For case 8 it is different
    if i == 8:
        pattern = r"(case 8:\n\s*return `)([\s\S]*?)(          <div class=\"mt-8 flex flex-col items-center gap-3\">)"
        match = re.search(pattern, content)
        if match:
            inner_content = match.group(2)
            # Add wrapper to inner content
            wrapped = f'<div class="${{window.switchTabLast > 8 ? \'wizard-slide-in-left\' : \'wizard-slide-in-right\'}}">\n{inner_content}'
            # Add "Back" button to case 8 buttons
            new_buttons = f"""          <div class="mt-8 flex flex-col items-center gap-3">
            <div class="flex w-full gap-3">
              <button type="button" onclick="window.switchTabLast = AppState.currentTab; AppState.currentTab = 7; renderApp()" class="flex-1 py-3 border-2 border-zero-black rounded-sm text-xs font-bold text-zero-black hover:bg-gray-50 transition-all text-center">KEMBALI</button>
              <button type="button" onclick="saveDraft()" class="flex-1 py-3 border-2 border-zero-black rounded-sm text-[10px] font-bold text-zero-black hover:bg-gray-50 transition-all text-center">SIMPAN DRAFT</button>
            </div>
            <button type="button" onclick="openPreviewModal()" class="w-full py-4 bg-zero-black rounded-sm text-sm font-bold text-white shadow-lg hover:bg-gray-800 transition-all text-center">TINJAU & KIRIM</button>
          </div>
        </div>"""
            content = content[:match.start()] + match.group(1) + wrapped + new_buttons + content[match.end():]
    else:
        pattern = rf"(case {i}:\n\s*return `)([\s\S]*?)(      `;)"
        match = re.search(pattern, content)
        if match:
            inner_content = match.group(2)
            wrapped = f'<div class="${{window.switchTabLast > {i} ? \'wizard-slide-in-left\' : \'wizard-slide-in-right\'}}">\n{inner_content}\n{get_nav_buttons(i)}\n        </div>\n'
            content = content[:match.start()] + match.group(1) + wrapped + match.group(3) + content[match.end():]

with open('Partial-Form-Daily.html', 'w') as f:
    f.write(content)

