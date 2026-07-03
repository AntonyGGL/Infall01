import sys

css_file = 'c:/Users/yeise/Downloads/Infall01/interfaz01.css'

new_css = """
/* --- NUEVOS ESTILOS PARA TECH CAROUSEL (DISEÑO TARJETAS) --- */
.tech-carousel-scrollable {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox */
    padding: 10px 0;
    width: 100%;
}
.tech-carousel-scrollable::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.tech-arrow {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-white);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.tech-arrow:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%) scale(1.1);
}
.arrow-prev { left: 0; }
.arrow-next { right: 0; }

.tech-item {
    flex: 0 0 auto;
    width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 30px 15px 20px;
    background: #0f1115; /* Fondo oscuro de la tarjeta */
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    cursor: pointer;
    position: relative;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    animation: none !important; /* Quitamos la animación de flotar antigua */
}

.tech-item:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    border-color: rgba(255, 255, 255, 0.08);
}

.tech-item .tech-logo {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: transparent !important;
    border: none !important;
}
.tech-item:hover .tech-logo {
    transform: scale(1.1);
    background: transparent !important;
    border-color: transparent !important;
}
.tech-item:hover .tech-logo svg,
.tech-item:hover .tech-logo img {
    filter: drop-shadow(0 0 12px var(--tech-glow));
    transform: none;
}

.tech-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-white);
    margin: 0;
}

.tech-category {
    font-size: 11px;
    font-weight: 500;
    color: var(--tech-glow);
    margin: 0 0 15px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
}

.tech-glow-line {
    width: 24px;
    height: 3px;
    border-radius: 2px;
    background: var(--tech-glow);
    box-shadow: 0 0 8px var(--tech-glow);
    margin-top: auto;
    transition: width 0.3s ease;
}

.tech-item:hover .tech-glow-line {
    width: 40px;
}

/* Colores personalizados */
.tech-item[data-tech="reniec"]    { --tech-glow: #F24E1E; --tech-glow-rgb: 242, 78, 30; }
.tech-item[data-tech="sunat"]     { --tech-glow: #3178C6; --tech-glow-rgb: 49, 120, 198; }
.tech-item[data-tech="aws"]       { --tech-glow: #FF9900; --tech-glow-rgb: 255, 153, 0; }
.tech-item[data-tech="gcp"]       { --tech-glow: #4285F4; --tech-glow-rgb: 66, 133, 244; }
.tech-item[data-tech="azure"]     { --tech-glow: #0078D4; --tech-glow-rgb: 0, 120, 212; }
.tech-item[data-tech="supabase"]  { --tech-glow: #3ECF8E; --tech-glow-rgb: 62, 207, 142; }
.tech-item[data-tech="angular"]   { --tech-glow: #DD0031; --tech-glow-rgb: 221, 0, 49; }

/* Ocultar elementos sobrantes del diseño anterior si interfieren */
.tech-carousel-wrapper::before,
.tech-carousel-wrapper::after {
    display: none !important; 
}
"""

with open(css_file, 'a', encoding='utf-8') as f:
    f.write(new_css)

print('Successfully appended CSS')
