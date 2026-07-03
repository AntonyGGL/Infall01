import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Tech intro
tech_pattern = r'(<h2 class="section-title"[^>]*>Tech\s*Stack que Utilizamos</h2>)'
tech_replacement = r'\1\n            <p style="text-align: center; color: var(--text-muted); font-size: 16px; max-width: 600px; margin: 0 auto 48px; line-height: 1.6;">Desarrollamos soluciones a medida empleando tecnologías de vanguardia. Nuestro ecosistema de desarrollo asegura productos rápidos, seguros y completamente escalables para el crecimiento de tu negocio.</p>'
if not 'Desarrollamos soluciones a medida' in content:
    content = re.sub(tech_pattern, tech_replacement, content)

# Testimonial 1
t1_pat = r'"INFALL transformó.*?números reales\."'
content = re.sub(t1_pat, '"INFALL superó todas nuestras expectativas. La plataforma de e-commerce que diseñaron triplicó nuestras ventas online en el primer trimestre. Su enfoque en velocidad y conversión es impresionante."', content, flags=re.DOTALL)

# Testimonial 2
t2_pat = r'"Lo que más valoro es que no usan plantillas.*?mi ciudad\."'
content = re.sub(t2_pat, '"Buscábamos una agencia que no nos vendiera plantillas genéricas. INFALL construyó nuestra web app desde cero. El nivel de detalle técnico y la arquitectura que implementaron es de clase mundial."', content, flags=re.DOTALL)

# Testimonial 3
t3_pat = r'"Profesionales en todo sentido.*?sin dudarlo\."'
content = re.sub(t3_pat, '"La comunicación fue impecable de principio a fin. Nos mantuvieron al tanto en cada etapa, y el producto final es increíblemente rápido y seguro. Definitivamente el mejor partner tecnológico."', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

with open('quienes-somos.html', 'r', encoding='utf-8') as f:
    content_qs = f.read()

qs_pat = r'<div class="about-text">\s*<p>Somos la consultoría.*?sin fronteras\.</p>'
qs_repl = '''<div class="about-text">
                        <p>En INFALL Systems Engineering somos arquitectos de soluciones digitales de alto impacto. Nuestro objetivo no es hacer páginas web comunes, sino construir plataformas robustas, escalables y orientadas a resultados tangibles para nuestros clientes.</p>
                        <p>Rechazamos las soluciones prefabricadas y lentas. Implementamos desarrollos personalizados desde cero, utilizando stacks modernos e infraestructura sólida para posicionar tu marca y optimizar la captación de prospectos en todo el mundo.</p>'''
if not 'arquitectos de soluciones digitales' in content_qs:
    content_qs = re.sub(qs_pat, qs_repl, content_qs, flags=re.DOTALL)

with open('quienes-somos.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content_qs)

print("Done")
