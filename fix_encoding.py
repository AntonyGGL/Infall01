# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all the encoding glitches
replacements = {
    'ANo': '¿No',
    'quAc': 'qué',
    'CuAcntanos': 'Cuéntanos',
    'GarcAa': 'García',
    'AQuAc': '¿Qué',
    'AAadir': 'Añadir',
    'NavegaciA3n': 'Navegación',
    'QuiAcnes': 'Quiénes',
    'TAcrminos': 'Términos',
    'PolA-ticas': 'Políticas',
    'precisiA3n arquitectA3nica': 'precisión arquitectónica',
    'Ac 2026': '&copy; 2026'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Remove the broken modal
pattern_modal = r'<h3 class=\"golden-title\">Complementa tu[\s\S]*?</div>\s*</div>\s*</div>\s*<!-- Cursor personalizado glow -->'
content = re.sub(pattern_modal, '\n    <!-- Cursor personalizado glow -->', content)

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Fixes applied.")
