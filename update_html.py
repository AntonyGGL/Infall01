import sys
html_file = 'c:/Users/yeise/Downloads/Infall01/index.html'

with open(html_file, 'r', encoding='utf-8') as f:
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
        <div class="tech-stack-container">
            <h2 class="section-title" style="color: var(--text-white); text-align: center; margin-bottom: 24px;">Empresas y Tecnologías que <span class="gradient-text">Nos Respaldan</span></h2>
            <p style="text-align: center; color: var(--text-muted); font-size: 16px; max-width: 600px; margin: 0 auto 48px; line-height: 1.6;">Un ecosistema tecnológico de primer nivel. Utilizamos las herramientas, frameworks y servicios en la nube más demandados del mundo para garantizar plataformas robustas, escalables y ultrarrápidas.</p>

            <div class="tech-carousel-wrapper" id="tech-carousel-wrapper" style="position: relative; padding: 20px 40px; display: flex; align-items: center;">
                <button class="slider-arrow arrow-prev tech-arrow" id="tech-prev" aria-label="Anterior" style="position:absolute; left:0; z-index:10;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                <div class="tech-carousel-scrollable" id="tech-carousel" style="display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 10px 0;">
                    <!-- RENIEC API -->
                    <div class="tech-item featured" data-tech="reniec" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6v-4m0-4h.01M8 12a4 4 0 0 1 8 0M6 12a6 6 0 0 1 12 0"/></svg>
                        </div>
                        <p class="tech-name">RENIEC API</p>
                        <p class="tech-category">Integración</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- SUNAT API -->
                    <div class="tech-item featured" data-tech="sunat" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <p class="tech-name">SUNAT API</p>
                        <p class="tech-category">Integración</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- AWS -->
                    <div class="tech-item featured" data-tech="aws" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Amazon AWS</p>
                        <p class="tech-category">Cloud</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Google Cloud -->
                    <div class="tech-item featured" data-tech="gcp" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="Google Cloud" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Google Cloud</p>
                        <p class="tech-category">Cloud</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Azure -->
                    <div class="tech-item featured" data-tech="azure" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" alt="Microsoft Azure" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Microsoft Azure</p>
                        <p class="tech-category">Cloud</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Supabase -->
                    <div class="tech-item" data-tech="supabase" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Supabase</p>
                        <p class="tech-category">Backend as a Service</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- MySQL -->
                    <div class="tech-item" data-tech="mysql" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">MySQL</p>
                        <p class="tech-category">Base de Datos</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- PostgreSQL -->
                    <div class="tech-item" data-tech="postgresql" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">PostgreSQL</p>
                        <p class="tech-category">Base de Datos</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- MongoDB -->
                    <div class="tech-item" data-tech="mongodb" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">MongoDB</p>
                        <p class="tech-category">Base de Datos</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Next.js -->
                    <div class="tech-item" data-tech="nextjs" style="scroll-snap-align: start;">
                        <div class="tech-logo tech-logo-invert">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Next.js</p>
                        <p class="tech-category">Framework</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- React -->
                    <div class="tech-item" data-tech="react" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">React</p>
                        <p class="tech-category">Frontend</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Angular -->
                    <div class="tech-item" data-tech="angular" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" alt="Angular" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Angular</p>
                        <p class="tech-category">Frontend</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Tailwind CSS -->
                    <div class="tech-item" data-tech="tailwind" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Tailwind CSS</p>
                        <p class="tech-category">Diseño UI</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- GitHub -->
                    <div class="tech-item" data-tech="github" style="scroll-snap-align: start;">
                        <div class="tech-logo tech-logo-invert">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">GitHub</p>
                        <p class="tech-category">Repositorios</p>
                        <div class="tech-glow-line"></div>
                    </div>

                    <!-- Figma -->
                    <div class="tech-item" data-tech="figma" style="scroll-snap-align: start;">
                        <div class="tech-logo">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" width="38" height="38" loading="lazy">
                        </div>
                        <p class="tech-name">Figma</p>
                        <p class="tech-category">Diseño UI/UX</p>
                        <div class="tech-glow-line"></div>
                    </div>
                </div>

                <button class="slider-arrow arrow-next tech-arrow" id="tech-next" aria-label="Siguiente" style="position:absolute; right:0; z-index:10;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
            
            <style>
                /* Scrollbar hiding for carousel */
                .tech-carousel-scrollable::-webkit-scrollbar {
                    display: none;
                }
            </style>

            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const techScroll = document.getElementById('tech-carousel');
                    const techPrev = document.getElementById('tech-prev');
                    const techNext = document.getElementById('tech-next');

                    if(techScroll && techPrev && techNext) {
                        const scrollAmount = 300;
                        techPrev.addEventListener('click', () => {
                            techScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                        });
                        techNext.addEventListener('click', () => {
                            techScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        });
                    }
                });
            </script>
        </div>
    </section>"""

new_lines = lines[:start_idx] + [new_tech_html + '\n'] + lines[end_idx+1:]
with open(html_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully updated HTML')
