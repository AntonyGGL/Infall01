# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix encoding issues that were just pasted in
content = content.replace('IntegraciA3n', 'Integración')
content = content.replace('ADeseas', '¿Deseas')
content = content.replace('diseAo web', 'diseño web')
content = content.replace('SA-,', 'Sí,')
content = content.replace('ADeseas', '¿Deseas')
content = content.replace('diseAo', 'diseño')

# Fix the broken modal at the end
pattern_modal = r'<h3 class="golden-title">Complementa tu[\s\S]*?</div>\s*</div>\s*</div>\s*<!-- Cursor personalizado glow -->'
content = re.sub(pattern_modal, '\n    <!-- Cursor personalizado glow -->', content)

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
