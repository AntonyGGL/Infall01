import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Safely remove dropdown item
    pattern1 = r'\s*<a href="servicios\.html#web-corporativa" class="dropdown-item">[\s\S]*?</a>'
    content = re.sub(pattern1, '', content)
    
    # Remove from cotizacion option
    pattern3 = r'\s*<option value="Web Corporativa">Web Corporativa</option>'
    content = re.sub(pattern3, '', content)
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
print('Safely removed Web Corporativa')
