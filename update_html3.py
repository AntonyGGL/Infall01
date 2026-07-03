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
            .ct-section {
                padding: 40px 20px 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }
            .ct-container {
                background: #11131a;
                border-radius: 20px;
                padding: 30px 60px;
                width: 100%;
                max-width: 1200px;
                position: relative;
                box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
            }
            .ct-track-wrap {
                width: 100%;
                overflow: hidden;
                padding: 20px 0;
            }
            .ct-track {
                display: flex;
                gap: 16px;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
            }
            .ct-track::-webkit-scrollbar { display: none; }
            
            .ct-card {
                flex: 0 0 auto;
                width: 140px;
                height: 200px;
                background: #181b24;
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 25px 10px 20px;
                scroll-snap-align: start;
                border: 1px solid rgba(255,255,255,0.03);
                transition: transform 0.3s ease, background 0.3s ease;
                cursor: pointer;
            }
            .ct-card:hover {
                transform: translateY(-5px);
                background: #1c202a;
            }

            .ct-icon-wrapper {
                height: 44px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: auto;
            }
            .ct-icon-mask {
                width: 40px;
                height: 40px;
                background-color: var(--c);
                -webkit-mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
                mask-size: contain;
                mask-repeat: no-repeat;
                mask-position: center;
                filter: drop-shadow(0 0 12px var(--c));
            }
            .ct-icon-wrapper img {
                width: 40px;
                height: 40px;
                filter: drop-shadow(0 0 12px var(--c));
            }
            .ct-inline-svg {
                width: 40px;
                height: 40px;
                color: var(--c);
                filter: drop-shadow(0 0 12px var(--c));
            }

            .ct-title {
                color: #ffffff;
                font-size: 13px;
                font-weight: 700;
                margin: 0 0 6px 0;
                text-align: center;
                font-family: 'Sora', sans-serif;
                letter-spacing: -0.2px;
            }
            .ct-subtitle {
                color: var(--c);
                font-size: 11px;
                font-weight: 500;
                margin: 0;
                text-align: center;
            }
            .ct-line {
                width: 20px;
                height: 3px;
                border-radius: 2px;
                background: var(--c);
                box-shadow: 0 0 8px var(--c);
                margin-top: 15px;
            }

            .ct-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: transparent;
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                transition: background 0.3s;
            }
            .ct-arrow:hover { background: rgba(255,255,255,0.1); }
            .ct-prev { left: 10px; }
            .ct-next { right: 10px; }

            .ct-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 25px;
            }
            .ct-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.3);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s;
            }
            .ct-dot.active {
                background: #5f27cd;
                border-color: #5f27cd;
                box-shadow: 0 0 8px #5f27cd;
            }

            @media (max-width: 768px) {
                .ct-container { padding: 30px 15px; border-radius: 16px; }
                .ct-arrow { display: none; }
            }
        </style>

        <div class="ct-section">
            <h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Empresas y Tecnologías que <span class="gradient-text">Nos Respaldan</span></h2>
            
            <div class="ct-container">
                <button class="ct-arrow ct-prev" id="ct-prev" aria-label="Anterior">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                <div class="ct-track-wrap">
                    <div class="ct-track" id="ct-track">
                        <!-- RENIEC -->
                        <div class="ct-card" style="--c: #ff4d4f;">
                            <div class="ct-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ct-inline-svg"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6v-4m0-4h.01M8 12a4 4 0 0 1 8 0M6 12a6 6 0 0 1 12 0"/></svg>
                            </div>
                            <div class="ct-title">RENIEC API</div>
                            <div class="ct-subtitle">Integración</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- MySQL -->
                        <div class="ct-card" style="--c: #3498db;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg');"></div>
                            </div>
                            <div class="ct-title">MySQL</div>
                            <div class="ct-subtitle">Base de Datos</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- PostgreSQL -->
                        <div class="ct-card" style="--c: #3498db;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postgresql.svg');"></div>
                            </div>
                            <div class="ct-title">PostgreSQL</div>
                            <div class="ct-subtitle">Base de Datos</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- MongoDB -->
                        <div class="ct-card" style="--c: #2ecc71;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg');"></div>
                            </div>
                            <div class="ct-title">MongoDB</div>
                            <div class="ct-subtitle">Base de Datos</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Tailwind CSS -->
                        <div class="ct-card" style="--c: #00d2d3;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tailwindcss.svg');"></div>
                            </div>
                            <div class="ct-title">Tailwind CSS</div>
                            <div class="ct-subtitle">Frontend</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- GitHub -->
                        <div class="ct-card" style="--c: #ffffff;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg');"></div>
                            </div>
                            <div class="ct-title">GitHub</div>
                            <div class="ct-subtitle">Repositorios</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Figma -->
                        <div class="ct-card" style="--c: #ff7f50;">
                            <div class="ct-icon-wrapper">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma">
                            </div>
                            <div class="ct-title">Figma</div>
                            <div class="ct-subtitle">Diseño UI/UX</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- HTML5 -->
                        <div class="ct-card" style="--c: #ff9f43;">
                            <div class="ct-icon-wrapper">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5">
                            </div>
                            <div class="ct-title">HTML5</div>
                            <div class="ct-subtitle">Frontend</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Supabase -->
                        <div class="ct-card" style="--c: #1dd1a1;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/supabase.svg');"></div>
                            </div>
                            <div class="ct-title">Supabase</div>
                            <div class="ct-subtitle">BaaS</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Angular -->
                        <div class="ct-card" style="--c: #ff4757;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/angular.svg');"></div>
                            </div>
                            <div class="ct-title">Angular</div>
                            <div class="ct-subtitle">Frontend</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- AWS -->
                        <div class="ct-card" style="--c: #ff9f43;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg');"></div>
                            </div>
                            <div class="ct-title">Amazon AWS</div>
                            <div class="ct-subtitle">Cloud</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Google Cloud -->
                        <div class="ct-card" style="--c: #4285F4;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg');"></div>
                            </div>
                            <div class="ct-title">Google Cloud</div>
                            <div class="ct-subtitle">Cloud</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- Microsoft Azure -->
                        <div class="ct-card" style="--c: #48dbfb;">
                            <div class="ct-icon-wrapper">
                                <div class="ct-icon-mask" style="-webkit-mask-image: url('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftazure.svg');"></div>
                            </div>
                            <div class="ct-title">Microsoft Azure</div>
                            <div class="ct-subtitle">Cloud</div>
                            <div class="ct-line"></div>
                        </div>

                        <!-- SUNAT API -->
                        <div class="ct-card" style="--c: #54a0ff;">
                            <div class="ct-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ct-inline-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            </div>
                            <div class="ct-title">SUNAT API</div>
                            <div class="ct-subtitle">Integración</div>
                            <div class="ct-line"></div>
                        </div>
                    </div>
                </div>

                <button class="ct-arrow ct-next" id="ct-next" aria-label="Siguiente">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>

            <div class="ct-dots">
                <div class="ct-dot active"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
                <div class="ct-dot"></div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const track = document.getElementById('ct-track');
                    const prev = document.getElementById('ct-prev');
                    const next = document.getElementById('ct-next');
                    
                    if(track && prev && next) {
                        const scrollAmt = 156 * 3; 
                        prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
                        next.addEventListener('click', () => track.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
                    }
                });
            </script>
        </div>
    </section>"""

new_lines = lines[:start_idx] + [new_tech_html + '\\n'] + lines[end_idx+1:]
with open(html_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully updated HTML')
