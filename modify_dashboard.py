import re
with open('Partial-Dashboard-GM.html', 'r') as f:
    content = f.read()

new_bottom = """${bottomItems.map((item, idx) => `
                    <div class="flex flex-col gap-0 border border-red-100 rounded-lg overflow-hidden bg-white shadow-sm mb-3">
                      <div class="flex justify-between items-center p-3 bg-red-50/50">
                        <div class="flex items-center gap-2">
                          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-[9px] font-black text-red-600">${idx + 1}</span>
                          <span class="text-xs font-bold text-zero-black">${item.nama}</span>
                        </div>
                        <span class="text-xs font-black text-red-600">${item.terjual} <span class="text-[9px] font-normal text-red-400">terjual</span></span>
                      </div>
                      ${item.rencana ? `
                        <div class="p-3 bg-white border-t border-red-50 relative">
                          <span class="block text-[8px] font-black text-zero-gray uppercase tracking-widest mb-1">ACTION PLAN</span>
                          <p class="text-[10px] text-zero-black leading-relaxed font-medium">${item.rencana}</p>
                        </div>
                      ` : `
                        <div class="p-3 bg-red-50/30 border-t border-red-100 relative">
                           <span class="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">! WARNING</span>
                           <p class="text-[9px] text-red-600 font-bold leading-relaxed">TIDAK ADA RENCANA TINDAKAN DARI SPV</p>
                        </div>
                      `}
                    </div>
                  `).join('')}"""

content = re.sub(r"\$\{bottomItems\.map\(\(item, idx\) => `.*?`\)\.join\(''\)\}", new_bottom, content, flags=re.DOTALL)

with open('Partial-Dashboard-GM.html', 'w') as f:
    f.write(content)
