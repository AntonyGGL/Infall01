import re
import subprocess

index_content = subprocess.check_output(['git', 'show', ':0:index.html']).decode('utf-8', errors='ignore')

pattern1 = r'\s*<a href="servicios\.html#web-corporativa" class="dropdown-item">[\s\S]*?</a>'
new_content = re.sub(pattern1, '', index_content)

print('Old length:', len(index_content))
print('New length:', len(new_content))
