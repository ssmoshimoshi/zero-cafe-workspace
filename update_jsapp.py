import sys

with open('Partial-Form-Daily.html', 'r') as f:
    partial_lines = f.readlines()

# Extract getDailyTabContent
start_idx = -1
end_idx = -1
for i, line in enumerate(partial_lines):
    if line.startswith('function getDailyTabContent() {'):
        start_idx = i
    if start_idx != -1 and line.startswith('}'):
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print("Could not find getDailyTabContent in Partial-Form-Daily.html")
    sys.exit(1)

new_content = partial_lines[start_idx:end_idx+1]

with open('JS-App1.html', 'r') as f:
    js_lines = f.readlines()

js_start = -1
js_end = -1
for i, line in enumerate(js_lines):
    if line.startswith('function getDailyTabContent() {'):
        js_start = i
    if js_start != -1 and line.startswith('function addAuditRow() {'):
        # The line before addAuditRow is usually empty or }
        # Let's find the closing brace before addAuditRow
        js_end = i - 1
        while js_lines[js_end].strip() == '':
            js_end -= 1
        break

if js_start == -1 or js_end == -1:
    print("Could not find getDailyTabContent in JS-App1.html")
    sys.exit(1)

js_lines[js_start:js_end+1] = new_content

with open('JS-App1.html', 'w') as f:
    f.writelines(js_lines)

print("Successfully replaced getDailyTabContent in JS-App1.html")
