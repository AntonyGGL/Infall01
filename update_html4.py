import sys
html_file = 'c:/Users/yeise/Downloads/Infall01/index.html'

with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<section class="tech-stack-section reveal">' in line:
        if i > 0 and '<!-- Sección Stack Tecnológico -->' in lines[i-1]:
            start_idx = i - 1
        else:
            start_idx = i
    if start_idx != -1 and '</section>' in line and i > start_idx:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print('Could not find tech stack section')
    sys.exit(1)

# Card template function to keep it DRY
def make_card(tech, c, icon_html, title, subtitle):
    return f"""                        <!-- {title} -->
                        <div class="ct-card" style="--c: {c};">
                            <div class="ct-icon">
                                {icon_html}
                            </div>
                            <div class="ct-title">{title}</div>
                            <div class="ct-sub">{subtitle}</div>
                            <div class="ct-bar"></div>
                        </div>"""

cards_data = [
    ("reniec", "#ff4d4f", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:42px;height:42px;color:var(--c);filter:drop-shadow(0 0 10px var(--c));"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6v-4m0-4h.01M8 12a4 4 0 0 1 8 0M6 12a6 6 0 0 1 12 0"/></svg>', "RENIEC API", "Integración"),
    ("mysql", "#3498db", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL">', "MySQL", "Base de Datos"),
    ("postgresql", "#336791", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL">', "PostgreSQL", "Base de Datos"),
    ("mongodb", "#00ED64", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB">', "MongoDB", "Base de Datos"),
    ("tailwind", "#06B6D4", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS">', "Tailwind CSS", "Frontend"),
    ("github", "#c0c0c0", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" style="filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.5));">', "GitHub", "Repositorios"),
    ("figma", "#F24E1E", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma">', "Figma", "Diseño UI/UX"),
    ("html5", "#E34C26", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5">', "HTML5", "Frontend"),
    ("css3", "#1572B6", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS3">', "CSS3", "Frontend"),
    ("supabase", "#3ECF8E", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase">', "Supabase", "BaaS"),
    ("angular", "#DD0031", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" alt="Angular">', "Angular", "Frontend"),
    ("aws", "#FF9900", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" style="filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,153,0,0.5));">', "Amazon AWS", "Cloud"),
    ("gcp", "#4285F4", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="Google Cloud">', "Google Cloud", "Cloud"),
    ("azure", "#0078D4", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" alt="Azure">', "Microsoft Azure", "Cloud"),
    ("sunat", "#54a0ff", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:42px;height:42px;color:var(--c);filter:drop-shadow(0 0 10px var(--c));"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', "SUNAT API", "Integración"),
    ("react", "#61DAFB", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React">', "React", "Frontend"),
    ("nextjs", "#e0e0e0", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" style="filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.4));">', "Next.js", "Framework"),
    ("nodejs", "#68A063", '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js">', "Node.js", "Backend"),
]

# Generate original set with actual newlines
cards_set = "\n".join([make_card(*d) for d in cards_data])
# Generate doubled set for infinite loop scrolling marquee
doubled_cards = cards_set + "\n" + cards_set

new_tech_html = f"""    <!-- Sección Stack Tecnológico -->
    <section class="tech-stack-section reveal">
        <style>
            .ct-section {{
                padding: 40px 0 60px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                overflow: hidden;
            }}
            .ct-outer {{
                position: relative;
                width: 100%;
                max-width: 100%;
                display: flex;
                align-items: center;
                padding: 0;
            }}
            .ct-container {{
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 20px 0;
                width: 100%;
                overflow: hidden;
                position: relative;
            }}
            /* Smooth gradient overlays fading directly into background */
            .ct-container::before,
            .ct-container::after {{
                content: '';
                position: absolute;
                top: 0;
                width: 160px;
                height: 100%;
                z-index: 2;
                pointer-events: none;
            }}
            .ct-container::before {{
                left: 0;
                background: linear-gradient(to right, var(--bg-body, #0a0a0a) 0%, transparent 100%);
            }}
            .ct-container::after {{
                right: 0;
                background: linear-gradient(to left, var(--bg-body, #0a0a0a) 0%, transparent 100%);
            }}
            
            .ct-track {{
                display: flex;
                gap: 16px;
                width: max-content;
                animation: ct-marquee-scroll 50s linear infinite;
            }}
            .ct-track:hover {{
                animation-play-state: paused;
            }}
            
            @keyframes ct-marquee-scroll {{
                0% {{ transform: translateX(0); }}
                100% {{ transform: translateX(-50%); }}
            }}
            
            .ct-card {{
                flex: 0 0 130px;
                height: 195px;
                background: #161921;
                border-radius: 14px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 28px 10px 20px;
                border: 1px solid rgba(108, 92, 231, 0.15);
                box-shadow: 0 0 12px rgba(108, 92, 231, 0.12), inset 0 0 12px rgba(108, 92, 231, 0.04);
                transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
            }}
            .ct-card:hover {{
                transform: translateY(-5px);
                background: #1e222d;
                box-shadow: 0 0 20px rgba(108, 92, 231, 0.25), inset 0 0 15px rgba(108, 92, 231, 0.08);
            }}

            .ct-icon {{
                width: 44px;
                height: 44px;
                min-height: 44px;
                display: flex !important;
                align-items: center;
                justify-content: center;
                margin-bottom: auto;
            }}
            .ct-icon img,
            .ct-icon svg {{
                width: 42px !important;
                height: 42px !important;
                max-width: 42px !important;
                max-height: 42px !important;
                display: block !important;
                filter: drop-shadow(0 0 10px var(--c));
            }}
            .ct-title {{
                color: #fff;
                font-size: 13px;
                font-weight: 700;
                margin: 0 0 5px 0;
                text-align: center;
                font-family: 'Sora', sans-serif;
            }}
            .ct-sub {{
                color: var(--c);
                font-size: 10.5px;
                font-weight: 500;
                margin: 0;
                text-align: center;
            }}
            .ct-bar {{
                width: 22px;
                height: 3px;
                border-radius: 2px;
                background: var(--c);
                box-shadow: 0 0 8px var(--c);
                margin-top: 14px;
            }}

            @media (max-width: 768px) {{
                .ct-container {{ padding: 20px 0; }}
            }}
        </style>

        <div class="ct-section">
            <h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Empresas y Tecnologías que <span class="gradient-text">Nos Respaldan</span></h2>
            
            <div class="ct-outer">
                <div class="ct-container">
                    <div class="ct-track" id="ct-track">
{doubled_cards}
                    </div>
                </div>
            </div>
        </div>
    </section>"""

new_lines = lines[:start_idx] + [new_tech_html + '\n'] + lines[end_idx+1:]
with open(html_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully updated HTML')
