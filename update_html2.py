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

new_tech_html = """    <!-- Sección Stack Tecnológico -->
    <section class="tech-stack-section reveal">
        <style>
            .custom-tech-section {
                padding: 60px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }
            .custom-tech-container {
                background: #11141A;
                border-radius: 24px;
                padding: 40px 60px;
                max-width: 1200px;
                width: 100%;
                position: relative;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
            }
            .custom-tech-track-wrapper {
                width: 100%;
                overflow: hidden;
            }
            .custom-tech-track {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                padding-bottom: 10px;
            }
            .custom-tech-track::-webkit-scrollbar {
                display: none;
            }
            .custom-tech-card {
                flex: 0 0 auto;
                width: 150px;
                height: 220px;
                background: #181C25;
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 30px 15px 25px;
                scroll-snap-align: start;
                border: 1px solid rgba(255,255,255,0.02);
            }
            .custom-tech-icon {
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: auto;
            }
            .custom-tech-icon img,
            .custom-tech-icon svg {
                width: 44px;
                height: 44px;
            }
            /* Silhouettes via CSS filters for devicons */
            .icon-monochrome {
                filter: brightness(0) invert(1);
                opacity: 0.9;
            }
            /* Glow effects */
            .custom-tech-card[data-color="red"] .custom-tech-icon svg,
            .custom-tech-card[data-color="red"] .custom-tech-icon img { filter: brightness(0) invert(1) sepia(1) saturate(100) hue-rotate(-50deg) drop-shadow(0 0 12px rgba(255, 71, 87, 0.8)); }
            
            .custom-tech-card[data-color="blue"] .custom-tech-icon svg,
            .custom-tech-card[data-color="blue"] .custom-tech-icon img { filter: brightness(0) invert(1) sepia(1) saturate(100) hue-rotate(180deg) drop-shadow(0 0 12px rgba(46, 134, 222, 0.8)); }
            
            .custom-tech-card[data-color="green"] .custom-tech-icon svg,
            .custom-tech-card[data-color="green"] .custom-tech-icon img { filter: brightness(0) invert(1) sepia(1) saturate(100) hue-rotate(90deg) drop-shadow(0 0 12px rgba(29, 209, 161, 0.8)); }
            
            .custom-tech-card[data-color="cyan"] .custom-tech-icon svg,
            .custom-tech-card[data-color="cyan"] .custom-tech-icon img { filter: brightness(0) invert(1) sepia(1) saturate(100) hue-rotate(150deg) drop-shadow(0 0 12px rgba(72, 219, 251, 0.8)); }
            
            .custom-tech-card[data-color="white"] .custom-tech-icon svg,
            .custom-tech-card[data-color="white"] .custom-tech-icon img { filter: brightness(0) invert(1) drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)); }
            
            .custom-tech-card[data-color="orange"] .custom-tech-icon svg,
            .custom-tech-card[data-color="orange"] .custom-tech-icon img { filter: brightness(0) invert(1) sepia(1) saturate(100) hue-rotate(340deg) drop-shadow(0 0 12px rgba(255, 159, 67, 0.8)); }

            .custom-tech-title {
                color: #ffffff;
                font-size: 14px;
                font-weight: 700;
                margin: 0 0 6px 0;
                text-align: center;
                font-family: 'Sora', sans-serif;
            }
            .custom-tech-subtitle {
                font-size: 11px;
                font-weight: 600;
                margin: 0;
                text-align: center;
            }
            .custom-tech-card[data-color="red"] .custom-tech-subtitle { color: #ff4757; }
            .custom-tech-card[data-color="blue"] .custom-tech-subtitle { color: #2e86de; }
            .custom-tech-card[data-color="green"] .custom-tech-subtitle { color: #1dd1a1; }
            .custom-tech-card[data-color="cyan"] .custom-tech-subtitle { color: #48dbfb; }
            .custom-tech-card[data-color="white"] .custom-tech-subtitle { color: #c8d6e5; }
            .custom-tech-card[data-color="orange"] .custom-tech-subtitle { color: #ff9f43; }

            .custom-tech-line {
                width: 24px;
                height: 3px;
                border-radius: 2px;
                margin-top: 25px;
            }
            .custom-tech-card[data-color="red"] .custom-tech-line { background: #ff4757; box-shadow: 0 0 8px #ff4757; }
            .custom-tech-card[data-color="blue"] .custom-tech-line { background: #2e86de; box-shadow: 0 0 8px #2e86de; }
            .custom-tech-card[data-color="green"] .custom-tech-line { background: #1dd1a1; box-shadow: 0 0 8px #1dd1a1; }
            .custom-tech-card[data-color="cyan"] .custom-tech-line { background: #48dbfb; box-shadow: 0 0 8px #48dbfb; }
            .custom-tech-card[data-color="white"] .custom-tech-line { background: #ffffff; box-shadow: 0 0 8px #ffffff; }
            .custom-tech-card[data-color="orange"] .custom-tech-line { background: #ff9f43; box-shadow: 0 0 8px #ff9f43; }

            .custom-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: transparent;
                border: 1px solid rgba(255,255,255,0.15);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                transition: background 0.3s;
            }
            .custom-arrow:hover {
                background: rgba(255,255,255,0.1);
            }
            .custom-arrow-prev { left: 20px; }
            .custom-arrow-next { right: 20px; }
            
            @media (max-width: 768px) {
                .custom-tech-container { padding: 30px 15px; border-radius: 16px; }
                .custom-arrow { display: none; }
            }

            .custom-dots {
                display: flex;
                justify-content: center;
                gap: 12px;
                margin-top: 30px;
            }
            .custom-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.2);
                background: transparent;
                cursor: pointer;
            }
            .custom-dot.active {
                background: #5f27cd;
                border-color: #5f27cd;
                box-shadow: 0 0 8px #5f27cd;
            }
        </style>

        <div class="custom-tech-section">
            <h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Empresas y Tecnologías que <span class="gradient-text">Nos Respaldan</span></h2>
            
            <div class="custom-tech-container">
                <button class="custom-arrow custom-arrow-prev" id="ct-prev" aria-label="Anterior">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                <div class="custom-tech-track-wrapper">
                    <div class="custom-tech-track" id="ct-track">
                        <!-- RENIEC -->
                        <div class="custom-tech-card" data-color="red">
                            <div class="custom-tech-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6v-4m0-4h.01M8 12a4 4 0 0 1 8 0M6 12a6 6 0 0 1 12 0"/></svg>
                            </div>
                            <p class="custom-tech-title">RENIEC API</p>
                            <p class="custom-tech-subtitle">Integración</p>
                            <div class="custom-tech-line"></div>
                        </div>
                        
                        <!-- MySQL -->
                        <div class="custom-tech-card" data-color="blue">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">MySQL</p>
                            <p class="custom-tech-subtitle">Base de Datos</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- PostgreSQL -->
                        <div class="custom-tech-card" data-color="blue">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">PostgreSQL</p>
                            <p class="custom-tech-subtitle">Base de Datos</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- MongoDB -->
                        <div class="custom-tech-card" data-color="green">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">MongoDB</p>
                            <p class="custom-tech-subtitle">Base de Datos</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Tailwind CSS -->
                        <div class="custom-tech-card" data-color="cyan">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Tailwind CSS</p>
                            <p class="custom-tech-subtitle">Frontend</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- GitHub -->
                        <div class="custom-tech-card" data-color="white">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">GitHub</p>
                            <p class="custom-tech-subtitle">Repositorios</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Figma -->
                        <div class="custom-tech-card" data-color="orange">
                            <div class="custom-tech-icon">
                                <!-- Dejar Figma con colores normales, el hover ya le da un estilo, pero podemos aplicar filtro para igualar -->
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma">
                            </div>
                            <p class="custom-tech-title">Figma</p>
                            <p class="custom-tech-subtitle">Diseño UI/UX</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- HTML5 -->
                        <div class="custom-tech-card" data-color="orange">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">HTML5</p>
                            <p class="custom-tech-subtitle">Frontend</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- SUNAT API -->
                        <div class="custom-tech-card" data-color="blue">
                            <div class="custom-tech-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            </div>
                            <p class="custom-tech-title">SUNAT API</p>
                            <p class="custom-tech-subtitle">Integración</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- AWS -->
                        <div class="custom-tech-card" data-color="orange">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Amazon AWS</p>
                            <p class="custom-tech-subtitle">Cloud</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Google Cloud -->
                        <div class="custom-tech-card" data-color="blue">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="Google Cloud" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Google Cloud</p>
                            <p class="custom-tech-subtitle">Cloud</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Azure -->
                        <div class="custom-tech-card" data-color="cyan">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" alt="Microsoft Azure" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Microsoft Azure</p>
                            <p class="custom-tech-subtitle">Cloud</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Supabase -->
                        <div class="custom-tech-card" data-color="green">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Supabase</p>
                            <p class="custom-tech-subtitle">BaaS</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- React -->
                        <div class="custom-tech-card" data-color="cyan">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">React</p>
                            <p class="custom-tech-subtitle">Frontend</p>
                            <div class="custom-tech-line"></div>
                        </div>

                        <!-- Angular -->
                        <div class="custom-tech-card" data-color="red">
                            <div class="custom-tech-icon">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" alt="Angular" class="icon-monochrome">
                            </div>
                            <p class="custom-tech-title">Angular</p>
                            <p class="custom-tech-subtitle">Frontend</p>
                            <div class="custom-tech-line"></div>
                        </div>

                    </div>
                </div>

                <button class="custom-arrow custom-arrow-next" id="ct-next" aria-label="Siguiente">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>

            <div class="custom-dots">
                <div class="custom-dot active"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
                <div class="custom-dot"></div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const track = document.getElementById('ct-track');
                    const prev = document.getElementById('ct-prev');
                    const next = document.getElementById('ct-next');
                    
                    if(track && prev && next) {
                        const scrollAmt = 170 * 3; // Scroll 3 items
                        prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
                        next.addEventListener('click', () => track.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
                    }
                });
            </script>
        </div>
    </section>"""

new_lines = lines[:start_idx] + [new_tech_html + '\n'] + lines[end_idx+1:]
with open(html_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully updated HTML')
