# -*- coding: utf-8 -*-
import re

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content_idx = f.read()

# Tech Stack Intro
tech_title = '<h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Tech\n                Stack que Utilizamos</h2>'
tech_intro = '<h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Tech Stack que Utilizamos</h2>\n            <p style="text-align: center; color: var(--text-muted); font-size: 16px; max-width: 600px; margin: 0 auto 48px; line-height: 1.6;">Desarrollamos soluciones a medida empleando tecnologías de vanguardia. Nuestro ecosistema de desarrollo asegura productos rápidos, seguros y completamente escalables para el crecimiento de tu negocio.</p>'

content_idx = content_idx.replace(tech_title, tech_intro)
# Just in case the formatting is slightly different:
content_idx = re.sub(r'<h2 class="section-title" style="color: var\(--text-white\); text-align: center; margin-bottom: 24px;">Tech\s*Stack que Utilizamos</h2>', tech_intro, content_idx)

# Testimonials
test1_old = r'"INFALL transformó nuestra presencia digital por completo.*?"'
test1_new = '"INFALL superó todas nuestras expectativas. La plataforma de e-commerce que diseñaron triplicó nuestras ventas online en el primer trimestre. Su enfoque en velocidad y conversión es impresionante."'
content_idx = re.sub(test1_old, test1_new, content_idx, flags=re.DOTALL)

test2_old = r'"Lo que más valoro es que no usan plantillas.*?"'
test2_new = '"Buscábamos una agencia que no nos vendiera plantillas genéricas. INFALL construyó nuestra web app desde cero. El nivel de detalle técnico y la arquitectura que implementaron es de clase mundial."'
content_idx = re.sub(test2_old, test2_new, content_idx, flags=re.DOTALL)

test3_old = r'"Profesionales en todo sentido.*?"'
test3_new = '"La comunicación fue impecable de principio a fin. Nos mantuvieron al tanto en cada etapa, y el producto final es increíblemente rápido y seguro. Definitivamente el mejor partner tecnológico."'
content_idx = re.sub(test3_old, test3_new, content_idx, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content_idx)

# Update quienes-somos.html
with open('quienes-somos.html', 'r', encoding='utf-8') as f:
    content_qs = f.read()

about_old = r'<div class="about-text">\s*<p>Somos la consultoría de ingeniería web que convierte tu negocio en una presencia digital\s*sólida: páginas rápidas, seguras y optimizadas para que te encuentren en Google y\s*conviertan visitas en clientes\.</p>\s*<p>No usamos plantillas genéricas ni constructores lentos\. Diseñamos cada proyecto desde cero\s*con código limpio y la infraestructura exacta que cada negocio necesita para destacar en\s*Google y captar clientes sin fronteras\.</p>'
about_new = '''<div class="about-text">
                        <p>En INFALL Systems Engineering somos arquitectos de soluciones digitales de alto impacto. Nuestro objetivo no es hacer páginas web comunes, sino construir plataformas robustas, escalables y orientadas a resultados tangibles para nuestros clientes.</p>
                        <p>Rechazamos las soluciones prefabricadas y lentas. Implementamos desarrollos personalizados desde cero, utilizando stacks modernos e infraestructura sólida para posicionar tu marca y optimizar la captación de prospectos en todo el mundo.</p>'''
content_qs = re.sub(about_old, about_new, content_qs)

with open('quienes-somos.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content_qs)

print("Text rewritten successfully.")
