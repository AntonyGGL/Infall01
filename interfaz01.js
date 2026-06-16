// ============================================================
// INFALL Systems Engineering — Configuración
// ============================================================
const CONFIG = {
    whatsapp: {
        number: '51908536493',
        message: 'Hola INFALL, estoy interesado en una consulta gratis para un proyecto web profesional.'
    },
    email: 'ghtoxis@gmail.com'
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// 1. Efecto Scroll Header
// ============================================================
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================================
// 2. Menú Hamburguesa Móvil
// ============================================================
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const navMenu = document.getElementById('nav-menu');

menuToggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = menuToggleBtn.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        menuToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    }
});

const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const spans = menuToggleBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    });
});

// ============================================================
// 2.5 Dropdown Menú de Servicios
// ============================================================
(function () {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const isMobileWidth = window.innerWidth <= 968;
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (isMobileWidth) {
            // Comportamiento en mobile: toggle con click
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        } else {
            // Comportamiento en desktop: hover
            dropdown.addEventListener('mouseenter', () => {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        }
        
        // Cerrar dropdown cuando se hace clic en un item
        const items = dropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('active');
                if (!isMobileWidth) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                }
                // Cerrar menú hamburguesa si está abierto
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    const spans = menuToggleBtn.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                    menuToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    // Reajustar comportamiento al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        const isNowMobile = window.innerWidth <= 968;
        dropdowns.forEach(dropdown => {
            if (isNowMobile) {
                dropdown.classList.remove('active');
            }
        });
    });
})();

// ============================================================
// 3. Navegación activa por scroll (IntersectionObserver)
// ============================================================
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navAllLinks = document.querySelectorAll('#nav-menu a');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAllLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
})();

// ============================================================
// 4. Slider Profesional Fade
// ============================================================
(function () {
    const wrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const progressBar = document.getElementById('progress-bar');
    const counterCurrent = document.getElementById('counter-current');
    const counterTotal = document.getElementById('counter-total');

    if (!wrapper || slides.length === 0) return;

    let current = 0;
    const total = slides.length;
    const DURATION = prefersReducedMotion ? 12000 : 5000;
    let autoTimer;

    counterTotal.textContent = String(total).padStart(2, '0');

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', function () {
                goToSlide(i);
                resetAuto();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
    }

    function updateCounter() {
        counterCurrent.textContent = String(current + 1).padStart(2, '0');
    }

    function resetProgress() {
        if (prefersReducedMotion) return;
        progressBar.style.animation = 'none';
        void progressBar.offsetWidth;
        progressBar.style.animation = 'fillProgress ' + (DURATION / 1000) + 's linear forwards';
    }

    function goToSlide(index) {
        if (index === current) return;

        slides.forEach(s => {
            s.classList.remove('active');
            s.setAttribute('aria-hidden', 'true');
        });

        current = index;
        slides[current].classList.add('active');
        slides[current].setAttribute('aria-hidden', 'false');

        updateDots();
        updateCounter();
        resetProgress();
    }

    function nextSlide() { goToSlide((current + 1) % total); }
    function prevSlide() { goToSlide((current - 1 + total) % total); }

    function startAuto() {
        stopAuto();
        resetProgress();
        if (prefersReducedMotion) return;
        autoTimer = setInterval(nextSlide, DURATION);
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    function resetAuto() {
        stopAuto();
        startAuto();
    }

    prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });

    wrapper.addEventListener('mouseenter', () => {
        stopAuto();
        progressBar.style.animationPlayState = 'paused';
    });

    wrapper.addEventListener('mouseleave', () => {
        progressBar.style.animationPlayState = 'running';
        startAuto();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prevSlide(); resetAuto(); }
        if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
    });

    // Touch swipe
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { nextSlide(); } else { prevSlide(); }
            resetAuto();
        }
    }, { passive: true });

    // ARIA
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-roledescription', 'carrusel');
    wrapper.setAttribute('aria-label', 'Presentación de servicios INFALL');

    slides.forEach((slide, i) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'diapositiva');
        slide.setAttribute('aria-label', 'Diapositiva ' + (i + 1) + ' de ' + total);
        slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });

    createDots();
    startAuto();
})();

// ============================================================
// 5. Animación de Aparición con Scroll (IntersectionObserver)
// ============================================================
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(element => revealOnScroll.observe(element));

window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

// ============================================================
// 6. Toggle Modo Oscuro / Claro
// ============================================================
(function () {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
})();

// ============================================================
// 7. WhatsApp Widget (global, excluye cotizacion.html)
// ============================================================
(function () {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const excludePages = ['cotizacion.html'];
    if (excludePages.includes(currentPage)) return;

    const whatsappLink = 'https://wa.me/' + CONFIG.whatsapp.number + '?text=' + encodeURIComponent(CONFIG.whatsapp.message);
    const widgetHtml = `
        <div class="whatsapp-widget" id="whatsapp-widget">
            <div class="whatsapp-toast" id="whatsapp-toast">¡Empecemos tu proyecto!</div>
            <a id="whatsapp-button" class="whatsapp-button" href="${whatsappLink}" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                <span class="whatsapp-icon" aria-hidden="true">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="whatsapp-img" onerror="this.style.display='none'; var s=this.nextElementSibling; if(s) s.style.display='block';">
                    <svg class="fallback-whatsapp" width="34" height="34" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:none;">
                        <path d="M20.52 3.48A11.85 11.85 0 0012.04.03c-6.56 0-11.9 5.34-11.9 11.93 0 2.1.56 4.14 1.63 5.92L.99 23.64l5.95-1.56A11.82 11.82 0 0012.04 24c6.56 0 11.9-5.34 11.9-11.93 0-3.19-1.24-6.18-3.47-8.25z"/>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.271-.1-.47-.148-.67.15-.199.297-.767.967-.94 1.164-.174.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.67-1.612-.916-2.21-.24-.579-.48-.494-.66-.504-.17-.01-.374-.01-.57-.01-.197 0-.51.075-.777.362-.266.297-1.01 1.03-1.01 2.5 0 1.47 1.03 2.89 1.17 3.1.149.21 2.04 3.17 4.93 4.44.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.34-.07-.12-.27-.2-.56-.35z"/>
                    </svg>
                </span>
                <span class="whatsapp-label">Empecemos tu proyecto</span>
                <span class="whatsapp-badge" id="whatsapp-badge">1</span>
            </a>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHtml);

    const toast = document.getElementById('whatsapp-toast');
    const badge = document.getElementById('whatsapp-badge');
    const storageKey = 'whatsappToastSeen';

    if (!localStorage.getItem(storageKey)) {
        toast.classList.add('visible');
        localStorage.setItem(storageKey, 'true');
        window.setTimeout(() => toast.classList.remove('visible'), 5200);
    }

    // Badge behaviour: show the red "1" only until the user clicks the WhatsApp button.
    const badgeKey = 'whatsappBadgeClicked';
    if (badge) {
        if (localStorage.getItem(badgeKey)) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'inline-flex';
        }
    }

    const whatsappBtnEl = document.getElementById('whatsapp-button');
    if (whatsappBtnEl) {
        whatsappBtnEl.addEventListener('click', () => {
            // mark as clicked so the badge won't reappear across pages
            try { localStorage.setItem(badgeKey, 'true'); } catch (e) { /* ignore */ }
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
})();

// ============================================================
// 8. Tech Stack Marquee Dinámico + Partículas
// ============================================================
(function () {
    const carousel = document.getElementById('tech-carousel');
    const wrapper = document.getElementById('tech-carousel-wrapper');
    const canvas = document.getElementById('tech-particles-canvas');

    if (!carousel || !wrapper) return;

    // Desactivar partículas en mobile para mejor rendimiento
    const isMobile = window.innerWidth <= 768;

    // Clonar items para marquee infinito (duplicar set completo)
    const originalItems = Array.from(carousel.querySelectorAll('.tech-item'));
    originalItems.forEach(item => carousel.appendChild(item.cloneNode(true)));
    originalItems.forEach(item => carousel.appendChild(item.cloneNode(true)));

    // Pausar marquee en hover
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && !isMobile) {
        wrapper.addEventListener('mouseenter', () => carousel.classList.add('paused'));
        wrapper.addEventListener('mouseleave', () => carousel.classList.remove('paused'));
    }

    // Sistema de partículas — desactivado en mobile
    if (!canvas || prefersReducedMotion || isMobile) {
        if (canvas) canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticles() {
        particles = [];
        const count = Math.floor(wrapper.getBoundingClientRect().width / 80);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * wrapper.getBoundingClientRect().width,
                y: Math.random() * wrapper.getBoundingClientRect().height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.3 + 0.05,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function drawParticles() {
        const w = wrapper.getBoundingClientRect().width;
        const h = wrapper.getBoundingClientRect().height;
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.02;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            const currentOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 0, ${currentOpacity})`;
            ctx.fill();

            // Líneas de conexión entre partículas cercanas
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 140, 0, ${0.04 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
})();

// ============================================================
// 8b. Projects Carousel — Navegación Manual con Dots
// ============================================================
(function () {
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const dotsContainer = document.getElementById('projects-dots');

    if (!track || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll('.project-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slidesPerView = 3;

    // Calcular slides visibles según viewport
    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    // Crear dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(totalSlides / slidesPerView);
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('project-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir al grupo ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i * slidesPerView));
            dotsContainer.appendChild(dot);
        }
    }

    // Actualizar dots activos
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.project-dot');
        const activeDotIndex = Math.floor(currentIndex / slidesPerView);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeDotIndex);
        });
    }

    // Ir a slide específico
    function goToSlide(index) {
        const maxIndex = totalSlides - slidesPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const slideWidth = slides[0].offsetWidth + 30; // gap de 30px
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - slidesPerView);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + slidesPerView);
    });

    // Inicializar
    updateSlidesPerView();
    createDots();
    goToSlide(0);

    // Actualizar en resize
    window.addEventListener('resize', () => {
        updateSlidesPerView();
        createDots();
        goToSlide(Math.min(currentIndex, totalSlides - slidesPerView));
    });
})();

// ============================================================
// 9. Flip Cards — Soporte táctil
// ============================================================
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Si ya está en hover (desktop), no hacer toggle
        if (window.matchMedia('(hover: hover)').matches) return;
        card.classList.toggle('tapped');
    });

    // Cerrar al hacer tap fuera
    card.addEventListener('blur', () => {
        card.classList.remove('tapped');
    });
});

// ============================================================
// 9. Dashboard Float Panel — 2 ciclos y stop
// ============================================================
(function () {
    const dashboard = document.querySelector('.dashboard-mockup');
    if (!dashboard || prefersReducedMotion) return;

    const duration = 12000; // 2 ciclos de 6s
    dashboard.style.animationDuration = duration + 'ms';
    dashboard.style.animationIterationCount = '1';
    dashboard.style.animationFillMode = 'forwards';

    setTimeout(() => {
        dashboard.style.animation = 'none';
        dashboard.style.transform = 'translateY(0) rotate(0deg)';
    }, duration + 100);
})();

// ============================================================
// 10. Formulario de Cotización con FormSubmit
// ============================================================
(function () {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 8000);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = form.querySelector('#nombre').value.trim();
        const email = form.querySelector('#email').value.trim();
        const telefono = form.querySelector('#telefono').value.trim();
        const tipoProyecto = form.querySelector('#tipo_proyecto').value;
        const descripcion = form.querySelector('#descripcion').value.trim();
        const presupuesto = form.querySelector('#presupuesto').value;
        const botcheck = form.querySelector('input[name="botcheck"]');

        if (!nombre || !email || !tipoProyecto || !descripcion) {
            showMessage('Por favor completa todos los campos obligatorios.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Por favor ingresa un correo electrónico válido.', 'error');
            return;
        }

        // Honeypot spam check
        if (botcheck && botcheck.checked) {
            showMessage('✅ Cotización enviada con éxito. Te contactaremos en menos de 24 horas.', 'success');
            form.reset();
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-loading"></span> Enviando...';

        // Enviar con FormSubmit (AJAX JSON endpoint)
        const payload = {
            Nombre: nombre,
            Email: email,
            Teléfono: telefono || 'No especificado',
            'Tipo de Proyecto': tipoProyecto,
            Descripción: descripcion,
            Presupuesto: presupuesto || 'No especificado',
            _subject: '🔔 Nueva Cotización — ' + tipoProyecto + ' | INFALL',
            _captcha: 'false'
        };

        fetch('https://formsubmit.co/ajax/' + CONFIG.email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de servidor');
            }
            return response.json();
        })
        .then(data => {
            const messageText = (data.message || '').toLowerCase();
            const isActivationPending = messageText.includes('activate') || messageText.includes('activación') || messageText.includes('activation');

            if (data.success === 'true' || data.success === true || isActivationPending) {
                if (isActivationPending) {
                    showMessage('📧 ¡Casi listo! Por favor revisa tu bandeja de entrada en ghtoxis@gmail.com y haz clic en "Activate Form" para activar el envío de correos.', 'success');
                } else {
                    showMessage('✅ Cotización enviada con éxito. Te contactaremos en menos de 24 horas.', 'success');
                }
                form.reset();
            } else {
                showMessage('Ocurrió un error al enviar: ' + (data.message || 'Intenta de nuevo.'), 'error');
            }
        })
        .catch(() => {
            showMessage('Ocurrió un error de conexión. Intenta de nuevo o escríbenos por WhatsApp.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        });
    });
})();

// ============================================================
// 11. Filtros de Portafolio con animación
// ============================================================
(function () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    const grid = document.getElementById('portfolio-grid');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.add('fade-out');
                    card.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        card.classList.remove('fade-out');
                    });
                } else {
                    card.classList.add('fade-out');
                    card.addEventListener('transitionend', function handler() {
                        card.removeEventListener('transitionend', handler);
                        card.classList.add('hidden');
                    });
                }
            });
        });
    });
})();

// ============================================================
// 12. Typewriter Effect — Hero H1
// ============================================================
(function initTypewriter() {
    const el = document.getElementById('hero-typewriter');
    if (!el || prefersReducedMotion) return;

    const text = el.textContent;
    el.textContent = '';
    el.classList.add('typing');

    let i = 0;
    const speed = 65;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Finish — stop cursor blink after 2s
            setTimeout(() => el.closest('.typewriter-wrap') && el.closest('.typewriter-wrap').classList.add('done'), 2000);
        }
    }

    // Delay start slightly so page paints first
    setTimeout(type, 400);
})();

// ============================================================
// 13. Contadores Animados — IntersectionObserver
// ============================================================
(function initCounters() {
    const counters = document.querySelectorAll('.stat-counter-num[data-target]');
    if (!counters.length) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = prefersReducedMotion ? 0 : 1400;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(easeOut(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();

// ============================================================
// 14. Ripple Effect en Botones Primarios
// ============================================================
(function initRipple() {
    document.querySelectorAll('.btn-primary, .btn-pricing-primary').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-wave';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
})();

// ============================================================
// 15. Cursor — Glow Spotlight que sigue el puntero
// ============================================================
(function initCursor() {
    if (window.innerWidth <= 968) return;
    const dot = document.getElementById('cursor-dot');
    const glow = document.getElementById('cursor-glow');
    if (!dot || !glow) return;

    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;

    // Dot sigue exactamente
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });

    // Glow sigue con lag suave (lerp)
    function animateGlow() {
        glowX += (targetX - glowX) * 0.08;
        glowY += (targetY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Mostrar al entrar en ventana
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; glow.classList.add('active'); });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; glow.classList.remove('active'); });
    setTimeout(() => glow.classList.add('active'), 800);

    // Cambio de color glow al pasar por cards y botones
    const cardTargets = '.why-us-card, .testimonial-card, .pricing-card, .portfolio-card';
    document.querySelectorAll(cardTargets).forEach(el => {
        el.addEventListener('mouseenter', () => { glow.classList.add('on-card'); dot.style.background = 'var(--accent-cyan)'; });
        el.addEventListener('mouseleave', () => { glow.classList.remove('on-card'); dot.style.background = 'var(--accent-orange)'; });
    });

    // Dot: escala grande al pasar por links/botones
    const hoverTargets = 'a, button, .why-us-card, .testimonial-card, .pricing-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
})();

// ============================================================
// 17. Why-Us Cards — Mobile tap para flip
// ============================================================
(function initMobileFlip() {
    if (window.innerWidth > 768) return;
    document.querySelectorAll('.why-us-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
})();


// ============================================================
// 16. Scroll Reveal — Variantes de dirección (left / right)
// ============================================================
(function initDirectionalReveal() {
    const leftEls = document.querySelectorAll('.reveal-left');
    const rightEls = document.querySelectorAll('.reveal-right');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    leftEls.forEach(el => observer.observe(el));
    rightEls.forEach(el => observer.observe(el));

    // Trigger for elements already in viewport on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            [...leftEls, ...rightEls].forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) el.classList.add('visible');
            });
        }, 100);
    });
})();

// ============================================================
// 18. Mobile Optimizations — Desactivar efectos pesados
// ============================================================
(function initMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // Desactivar animación de float en el browser mockup
    const browserMockup = document.querySelector('.browser-mockup');
    if (browserMockup) {
        browserMockup.style.animation = 'none';
    }

    // Reducir duración del slider en mobile
    const sliderWrapper = document.getElementById('slider-wrapper');
    if (sliderWrapper) {
        // El slider ya tiene touch support, solo aseguramos que funcione bien
    }

    // Desactivar ripple effect en mobile (innecesario sin hover)
    document.querySelectorAll('.ripple-wave').forEach(el => el.remove());
})();

// ============================================================
// 19. Mobile Cover Flow Carousel — Why Us + Pricing
// ============================================================
(function initMobileCoverFlow() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // --- WHY-US CAROUSEL ---
    const whyUsGrid = document.querySelector('.why-us-grid');
    if (whyUsGrid) {
        const whyUsCards = whyUsGrid.querySelectorAll('.why-us-card');

        // Crear dots de navegación
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'why-us-dots';
        whyUsCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'why-us-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Ir a tarjeta ' + (i + 1));
            dot.addEventListener('click', () => {
                const cardWidth = whyUsCards[0].offsetWidth + 16; // gap
                whyUsGrid.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });
        whyUsGrid.parentNode.insertBefore(dotsContainer, whyUsGrid.nextSibling);

        // Centrar primera card al inicio
        requestAnimationFrame(() => {
            const firstCard = whyUsCards[0];
            if (firstCard) {
                const scrollLeft = firstCard.offsetLeft - (whyUsGrid.offsetWidth - firstCard.offsetWidth) / 2;
                whyUsGrid.scrollLeft = Math.max(0, scrollLeft);
            }
        });

        // Detectar card activa al hacer scroll
        let scrollTimer;
        whyUsGrid.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => updateActiveCard(whyUsGrid, whyUsCards, dotsContainer, 'why-us-dot'), 50);
        });

        // Click en card: flip si ya está activa, centrar si no
        whyUsCards.forEach((card) => {
            card.addEventListener('click', (e) => {
                // Si es un link dentro del card, no hacer flip
                if (e.target.closest('a')) return;

                if (!card.classList.contains('active')) {
                    // Centrar la card
                    const cardWidth = card.offsetWidth + 16;
                    const index = Array.from(whyUsCards).indexOf(card);
                    whyUsGrid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                } else {
                    // Flip
                    card.classList.toggle('flipped');
                }
            });
        });

        // Inicializar
        updateActiveCard(whyUsGrid, whyUsCards, dotsContainer, 'why-us-dot');
    }

    // --- PRICING CAROUSEL ---
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        const pricingCards = pricingGrid.querySelectorAll('.pricing-card');

        // Crear dots de navegación
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'pricing-dots';
        pricingCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'pricing-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Ir a plan ' + (i + 1));
            dot.addEventListener('click', () => {
                const cardWidth = pricingCards[0].offsetWidth + 16;
                pricingGrid.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });
        pricingGrid.parentNode.insertBefore(dotsContainer, pricingGrid.nextSibling);

        // Centrar primera card al inicio
        requestAnimationFrame(() => {
            const firstCard = pricingCards[0];
            if (firstCard) {
                const scrollLeft = firstCard.offsetLeft - (pricingGrid.offsetWidth - firstCard.offsetWidth) / 2;
                pricingGrid.scrollLeft = Math.max(0, scrollLeft);
            }
        });

        // Detectar card activa al hacer scroll
        let scrollTimer;
        pricingGrid.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => updateActiveCard(pricingGrid, pricingCards, dotsContainer, 'pricing-dot'), 50);
        });

        // Click en card: flip si ya está activa, centrar si no
        pricingCards.forEach((card) => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;

                if (!card.classList.contains('active')) {
                    const index = Array.from(pricingCards).indexOf(card);
                    const cardWidth = card.offsetWidth + 16;
                    pricingGrid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                } else {
                    card.classList.toggle('flipped');
                }
            });
        });

        // Inicializar
        updateActiveCard(pricingGrid, pricingCards, dotsContainer, 'pricing-dot');
    }

    // --- FUNCIÓN AUXILIAR: Detectar card activa ---
    function updateActiveCard(container, cards, dotsContainer, dotClass) {
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;
        let closestCard = null;
        let closestDist = Infinity;
        let closestIndex = 0;

        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(containerCenter - cardCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestCard = card;
                closestIndex = i;
            }
        });

        // Actualizar clases active
        cards.forEach((card, i) => {
            card.classList.toggle('active', card === closestCard);
        });

        // Actualizar dots
        const dots = dotsContainer.querySelectorAll('.' + dotClass);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === closestIndex);
        });
    }
})();

