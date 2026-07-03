# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace contact item
pattern_contact = r'<a href="tel:\+51922996170".*?>[\s\S]*?</a>'
new_contact = '''<a href="https://wa.me/51922996170?text=Hola%20INFALL,%20quisiera%20cotizar%20un%20proyecto%20web" target="_blank" class="contact-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        +51 922 996 170
                    </a>'''
content = re.sub(pattern_contact, new_contact, content)

# 2. Remove domainPromptModal
pattern_modal = r'\s*<!-- Modal \S+ Dominio\? \(Golden Ratio Design\) -->[\s\S]*?<div id="domainPromptModal" class="modal hidden">[\s\S]*?</div>\s*'
content = re.sub(pattern_modal, '\n    ', content)

# 3. Replace scripts
pattern_scripts = r'\s*<!-- Scripts -->[\s\S]*?<div class="cursor-dot" id="cursor-dot"></div>[\s\S]*?<div class="cursor-glow" id="cursor-glow"></div>[\s\S]*?<script src="cart\.js\?v=4"></script>[\s\S]*?<script src="interfaz01\.js\?v=12" defer></script>[\s\S]*?<script>[\s\S]*?window\.InfallCart\.open\(\);[\s\S]*?\}\);[\s\S]*?\}\)\(\);[\s\S]*?</script>'
new_scripts = '''
    <!-- Cursor personalizado glow -->
    <div class="cursor-dot" id="cursor-dot"></div>
    <div class="cursor-glow" id="cursor-glow"></div>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script src="interfaz01.js?v=5" defer></script>'''
content = re.sub(pattern_scripts, new_scripts, content)

# 4. Remove Web Corporativa just in case it wasn't removed fully
pattern_corp = r'\s*<a href="servicios\.html#web-corporativa" class="dropdown-item">[\s\S]*?</a>'
content = re.sub(pattern_corp, '', content)

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Restored.")
