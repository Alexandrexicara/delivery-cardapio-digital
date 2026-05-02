with open('admin.html', 'r', encoding='utf8') as f:
    content = f.read()

old = """<div class="tab" onclick="showTab('merchant')">💼 Comerciante</div>"""
new = """<div class="tab" onclick="window.location.href='merchant-dashboard.html'">💼 Comerciante</div>"""

content = content.replace(old, new)

with open('admin.html', 'w', encoding='utf8') as f:
    f.write(content)

print('✅ Correção do botão Comerciante aplicada!')
