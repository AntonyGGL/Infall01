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

// ============================================================
// 14. SISTEMA DE ACCESIBILIDAD GLOBAL
// ============================================================
(function () {
    const htmlEl = document.documentElement;
    
    // Diccionario de traducción para el menú y navegación
    const dictionary = {
        es: {
            title: "Menú de accesibilidad",
            langLabel: "Idioma: Español",
            profileLabel: "Perfil de accesibilidad",
            profileDefault: "Seleccionar perfil...",
            profileVisual: "Discapacidad Visual",
            profileAdhd: "TDAH (Enfoque)",
            profileCognitive: "Cognitivo / Dislexia",
            profileMotor: "Motor / Teclado",
            profileCustom: "Personalizado",
            cardTextSize: "Tamaño de texto",
            cardContrast: "Contrastes",
            cardCursor: "Cursor",
            cardReadingMask: "Máscara de lectura",
            cardDyslexia: "Dislexia amigable",
            cardLineHeight: "Interlineado",
            reset: "Restablecer"
        },
        en: {
            title: "Accessibility Menu",
            langLabel: "Language: English",
            profileLabel: "Accessibility Profile",
            profileDefault: "Select profile...",
            profileVisual: "Visual Impairment",
            profileAdhd: "ADHD (Reading focus)",
            profileCognitive: "Cognitive / Dyslexia",
            profileMotor: "Motor / Keyboard",
            profileCustom: "Custom",
            cardTextSize: "Text Size",
            cardContrast: "Contrast",
            cardCursor: "Cursor Size",
            cardReadingMask: "Reading Mask",
            cardDyslexia: "Dyslexia Friendly",
            cardLineHeight: "Line Spacing",
            reset: "Reset All"
        }
    };

    // Configuración de perfiles predefinidos
    const profiles = {
        none: {},
        visual: {
            fontSize: 2,
            contrast: 1,
            cursor: 1,
            readingMask: 0,
            dyslexia: 0,
            lineHeight: 0,
            focusHighlight: 0
        },
        adhd: {
            fontSize: 0,
            contrast: 0,
            cursor: 0,
            readingMask: 1,
            dyslexia: 0,
            lineHeight: 0,
            focusHighlight: 0
        },
        cognitive: {
            fontSize: 1,
            contrast: 0,
            cursor: 0,
            readingMask: 0,
            dyslexia: 1,
            lineHeight: 1,
            focusHighlight: 0
        },
        motor: {
            fontSize: 0,
            contrast: 0,
            cursor: 0,
            readingMask: 0,
            dyslexia: 0,
            lineHeight: 0,
            focusHighlight: 1
        },
        custom: {}
    };

    // Estado por defecto
    let accessibilityState = {
        lang: 'es',
        profile: 'none',
        fontSize: 0,       // 0 a 3
        contrast: 0,       // 0 a 3
        cursor: 0,         // 0 a 2
        readingMask: 0,    // 0 a 1
        dyslexia: 0,       // 0 a 1
        lineHeight: 0,      // 0 a 2
        focusHighlight: 0   // 0 a 1
    };

    // Selectores fallback para el escalado de fuentes (CORS)
    const fontScaleFallbackSelectors = [
        'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'li', 'button', 'input', 'label',
        '.description', '.logo-text', 'nav a', '.btn-nav', '.btn-slide-cta', '.btn-slide-ghost',
        '.slide-title', '.slide-desc', '.service-card h3', '.service-card p', '.about-text p',
        '.stat-counter-num', '.portfolio-card-body h3', '.portfolio-card-body p',
        '.footer-col h4', '.footer-col a', '.footer-col p', '.whatsapp-toast', '.why-us-card h3', '.why-us-card p',
        '.pricing-header h3', '.pricing-header p', '.pricing-price', '.pricing-features li'
    ];

    // Cargar estado guardado
    function loadState() {
        const saved = localStorage.getItem('accessibility_settings');
        if (saved) {
            try {
                accessibilityState = JSON.parse(saved);
            } catch (e) {
                console.error("No se pudo cargar el estado de accesibilidad:", e);
            }
        }
    }

    // Guardar estado en localStorage
    function saveState() {
        localStorage.setItem('accessibility_settings', JSON.stringify(accessibilityState));
    }

    // Inyectar la estructura del Widget en el DOM
    function injectWidget() {
        // Crear FAB (Botón flotante)
        const fab = document.createElement('button');
        fab.className = 'accessibility-fab';
        fab.id = 'accessibility-fab';
        fab.setAttribute('aria-label', 'Abrir menú de accesibilidad');
        fab.setAttribute('title', 'Menú de accesibilidad');
        fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`;
        document.body.appendChild(fab);

        // Crear Backdrop Overlay
        const overlay = document.createElement('div');
        overlay.className = 'accessibility-overlay';
        overlay.id = 'accessibility-overlay';
        document.body.appendChild(overlay);

        // Crear Sidebar Drawer
        const drawer = document.createElement('div');
        drawer.className = 'accessibility-drawer';
        drawer.id = 'accessibility-drawer';
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.innerHTML = `
            <div class="accessibility-header">
                <div class="accessibility-header-title">
                    <svg viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
                    <span id="acc-title-text">Menú de accesibilidad</span>
                </div>
                <button class="accessibility-close" id="accessibility-close" aria-label="Cerrar menú de accesibilidad">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="accessibility-body">
                <div class="accessibility-select-group">
                    <label class="accessibility-select-label" id="acc-lang-label" for="acc-lang-select">Idioma: Español</label>
                    <div class="accessibility-select-wrapper">
                        <select class="accessibility-select" id="acc-lang-select">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
                
                <div class="accessibility-select-group">
                    <label class="accessibility-select-label" id="acc-profile-label" for="acc-profile-select">Perfil de accesibilidad</label>
                    <div class="accessibility-select-wrapper">
                        <select class="accessibility-select" id="acc-profile-select">
                            <option value="none" id="acc-profile-default">Seleccionar perfil...</option>
                            <option value="visual" id="acc-profile-visual">Discapacidad Visual</option>
                            <option value="adhd" id="acc-profile-adhd">TDAH (Enfoque de lectura)</option>
                            <option value="cognitive" id="acc-profile-cognitive">Cognitivo / Dislexia</option>
                            <option value="motor" id="acc-profile-motor">Motor / Teclado</option>
                            <option value="custom" id="acc-profile-custom">Personalizado</option>
                        </select>
                    </div>
                </div>
                
                <div class="accessibility-grid">
                    <div class="accessibility-card" id="acc-card-size" data-type="fontSize">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-size">Tamaño de texto</span>
                        <div class="accessibility-bar" data-segments="3">
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                    
                    <div class="accessibility-card" id="acc-card-contrast" data-type="contrast">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v16z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-contrast">Contrastes</span>
                        <div class="accessibility-bar" data-segments="3">
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                    
                    <div class="accessibility-card" id="acc-card-cursor" data-type="cursor">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M5.92 3.11a1 1 0 0 1 1.63-.44l13.12 11.23a1 1 0 0 1-.5 1.76h-5.92l4.88 7.32a1 1 0 0 1-1.66 1.11l-4.88-7.32-3.88 3.88a1 1 0 0 1-1.7-.71V3.11z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-cursor">Cursor</span>
                        <div class="accessibility-bar" data-segments="2">
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                    
                    <div class="accessibility-card" id="acc-card-mask" data-type="readingMask">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-mask">Máscara de lectura</span>
                        <div class="accessibility-bar" data-segments="1">
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                    
                    <div class="accessibility-card" id="acc-card-dyslexia" data-type="dyslexia">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M9.62 5.5h2.76L16 16h-2.3l-1.07-3.07H7.36L6.3 16H4L7.62 5.5zm.77 1.83L8.03 11.2h3.94l-1.58-3.87zM16 13h5.5l-4.5 4.5h4.5v1.5H16l4.5-4.5H16V13z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-dyslexia">Dislexia amigable</span>
                        <div class="accessibility-bar" data-segments="1">
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                    
                    <div class="accessibility-card" id="acc-card-spacing" data-type="lineHeight">
                        <div class="accessibility-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M10 5h11v2H10V5zm0 12h11v2H10v-2zm0-6h11v2H10v-2zM3 5.5l3.5-3.5L10 5.5H7v13h3l-3.5 3.5L3 18.5h3v-13H3z"/></svg>
                        </div>
                        <span class="accessibility-card-label" id="acc-label-spacing">Interlineado</span>
                        <div class="accessibility-bar" data-segments="2">
                            <div class="accessibility-segment"></div>
                            <div class="accessibility-segment"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="accessibility-footer">
                <button class="accessibility-reset" id="accessibility-reset">
                    <svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    <span id="acc-reset-text">Restablecer</span>
                </button>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    // Actualizar la máscara de lectura con la posición Y del puntero
    function updateMaskPosition(e) {
        htmlEl.style.setProperty('--mask-y', e.clientY + 'px');
    }

    // Algoritmo avanzado para escalar tamaños de fuente leyendo stylesheets
    function applyFontScaling(level) {
        const scaleMap = [1.0, 1.15, 1.30, 1.45];
        const multiplier = scaleMap[level];
        
        let styleTag = document.getElementById('accessibility-text-scale');
        if (styleTag) styleTag.remove();
        
        if (level === 0) {
            htmlEl.style.zoom = '';
            const drawer = document.getElementById('accessibility-drawer');
            const fab = document.getElementById('accessibility-fab');
            if (drawer) drawer.style.zoom = '';
            if (fab) fab.style.zoom = '';
            return;
        }
        
        let cssRulesApplied = false;
        let css = '';
        
        try {
            for (let i = 0; i < document.styleSheets.length; i++) {
                let sheet = document.styleSheets[i];
                if (sheet.href && !sheet.href.includes(window.location.host) && !sheet.href.startsWith('/') && !sheet.href.startsWith(window.location.origin)) {
                    continue;
                }
                
                let rules;
                try {
                    rules = sheet.cssRules || sheet.rules;
                } catch (e) {
                    continue; // CORS block
                }
                
                if (!rules) continue;
                
                function parseRulesList(ruleList) {
                    let tempCss = '';
                    for (let j = 0; j < ruleList.length; j++) {
                        let rule = ruleList[j];
                        if (rule.type === CSSRule.MEDIA_RULE) {
                            let mediaRules = parseRulesList(rule.cssRules);
                            if (mediaRules) {
                                tempCss += `@media ${rule.media.mediaText} {\n${mediaRules}\n}\n`;
                            }
                        } else if (rule.style && rule.style.fontSize) {
                            let selector = rule.selectorText;
                            let fontSize = rule.style.fontSize;
                            
                            if (selector && (selector.includes('accessibility') || selector.includes('acc-') || selector.includes('.accessibility-'))) {
                                continue;
                            }
                            
                            if (fontSize.endsWith('px')) {
                                let px = parseFloat(fontSize);
                                tempCss += `${selector} { font-size: ${(px * multiplier).toFixed(1)}px !important; }\n`;
                            } else if (fontSize.endsWith('rem')) {
                                let rem = parseFloat(fontSize);
                                tempCss += `${selector} { font-size: ${(rem * multiplier).toFixed(2)}rem !important; }\n`;
                            } else if (fontSize.endsWith('em')) {
                                let em = parseFloat(fontSize);
                                tempCss += `${selector} { font-size: ${(em * multiplier).toFixed(2)}em !important; }\n`;
                            }
                        }
                    }
                    return tempCss;
                }
                
                css += parseRulesList(rules);
            }
            
            if (css.trim().length > 0) {
                styleTag = document.createElement('style');
                styleTag.id = 'accessibility-text-scale';
                styleTag.innerHTML = css;
                document.head.appendChild(styleTag);
                cssRulesApplied = true;
            }
        } catch (error) {
            console.warn("Error leyendo hojas de estilo, usando fallback zoom:", error);
        }
        
        if (!cssRulesApplied) {
            htmlEl.style.zoom = multiplier;
            const drawer = document.getElementById('accessibility-drawer');
            const fab = document.getElementById('accessibility-fab');
            if (drawer) drawer.style.zoom = (1 / multiplier).toFixed(3);
            if (fab) fab.style.zoom = (1 / multiplier).toFixed(3);
        }
    }

    // Traducir los enlaces de navegación del sitio web
    function applySiteTranslation(lang) {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            const links = navMenu.querySelectorAll('a:not(.dropdown-trigger)');
            const triggers = navMenu.querySelectorAll('.dropdown-trigger');
            
            const translations = {
                es: {
                    inicio: "Inicio",
                    quienes: "Quiénes Somos",
                    portafolio: "Portafolio",
                    servicios: "Servicios"
                },
                en: {
                    inicio: "Home",
                    quienes: "About Us",
                    portafolio: "Portfolio",
                    servicios: "Services"
                }
            };
            
            const t = translations[lang];
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                if (href.includes('index.html') || href === '#' || href === 'index.html') {
                    link.textContent = t.inicio;
                } else if (href.includes('quienes-somos.html')) {
                    link.textContent = t.quienes;
                } else if (href.includes('portfolio.html')) {
                    link.textContent = t.portafolio;
                }
            });
            
            triggers.forEach(trigger => {
                const href = trigger.getAttribute('href');
                if (href && href.includes('servicios.html')) {
                    trigger.textContent = t.servicios;
                }
            });
        }
        
        // Traducir el botón de cotización en el header
        const ctaNavBtn = document.querySelector('.nav-actions .btn-nav');
        if (ctaNavBtn) {
            const svg = ctaNavBtn.querySelector('svg');
            ctaNavBtn.innerHTML = '';
            if (svg) ctaNavBtn.appendChild(svg);
            ctaNavBtn.appendChild(document.createTextNode(lang === 'es' ? ' Cotizar Proyecto' : ' Get a Quote'));
        }
    }

    // Traducir las etiquetas del menú de accesibilidad
    function updateTranslations(lang) {
        const t = dictionary[lang];
        if (!t) return;
        
        document.getElementById('acc-title-text').textContent = t.title;
        document.getElementById('acc-lang-label').textContent = t.langLabel;
        document.getElementById('acc-profile-label').textContent = t.profileLabel;
        document.getElementById('acc-profile-default').textContent = t.profileDefault;
        document.getElementById('acc-profile-visual').textContent = t.profileVisual;
        document.getElementById('acc-profile-adhd').textContent = t.profileAdhd;
        document.getElementById('acc-profile-cognitive').textContent = t.profileCognitive;
        document.getElementById('acc-profile-motor').textContent = t.profileMotor;
        document.getElementById('acc-profile-custom').textContent = t.profileCustom;
        document.getElementById('acc-label-size').textContent = t.cardTextSize;
        document.getElementById('acc-label-contrast').textContent = t.cardContrast;
        document.getElementById('acc-label-cursor').textContent = t.cardCursor;
        document.getElementById('acc-label-mask').textContent = t.cardReadingMask;
        document.getElementById('acc-label-dyslexia').textContent = t.cardDyslexia;
        document.getElementById('acc-label-spacing').textContent = t.cardLineHeight;
        document.getElementById('acc-reset-text').textContent = t.reset;
    }

    // Actualizar visualmente los elementos en el Drawer
    function updateUIElements() {
        const profileSelect = document.getElementById('acc-profile-select');
        if (profileSelect) profileSelect.value = accessibilityState.profile;
        
        const langSelect = document.getElementById('acc-lang-select');
        if (langSelect) langSelect.value = accessibilityState.lang;
        
        const cards = document.querySelectorAll('.accessibility-card');
        cards.forEach(card => {
            const type = card.getAttribute('data-type');
            const level = accessibilityState[type];
            
            card.classList.toggle('active', level > 0);
            
            const segments = card.querySelectorAll('.accessibility-segment');
            segments.forEach((seg, i) => {
                seg.classList.toggle('active', i < level);
            });
        });
    }

    // Aplicar los ajustes guardados al DOM
    function applySettings() {
        // 1. Tamaño de texto
        applyFontScaling(accessibilityState.fontSize);
        
        // 2. Contrastes
        htmlEl.classList.remove('acc-contrast-high', 'acc-monochrome', 'acc-inverted');
        if (accessibilityState.contrast === 1) {
            htmlEl.classList.add('acc-contrast-high');
        } else if (accessibilityState.contrast === 2) {
            htmlEl.classList.add('acc-monochrome');
        } else if (accessibilityState.contrast === 3) {
            htmlEl.classList.add('acc-inverted');
        }
        
        // 3. Cursore gigante
        htmlEl.classList.remove('acc-cursor-1', 'acc-cursor-2');
        if (accessibilityState.cursor === 1) {
            htmlEl.classList.add('acc-cursor-1');
        } else if (accessibilityState.cursor === 2) {
            htmlEl.classList.add('acc-cursor-2');
        }
        
        // 4. Máscara de lectura
        let mask = document.getElementById('accessibility-reading-mask');
        if (!mask) {
            mask = document.createElement('div');
            mask.id = 'accessibility-reading-mask';
            mask.className = 'accessibility-reading-mask';
            document.body.appendChild(mask);
        }
        if (accessibilityState.readingMask === 1) {
            mask.style.display = 'block';
            window.addEventListener('mousemove', updateMaskPosition);
        } else {
            mask.style.display = 'none';
            window.removeEventListener('mousemove', updateMaskPosition);
        }
        
        // 5. Dislexia amigable
        htmlEl.classList.remove('acc-dyslexia');
        if (accessibilityState.dyslexia === 1) {
            htmlEl.classList.add('acc-dyslexia');
            let fontLink = document.getElementById('dyslexia-font-link');
            if (!fontLink) {
                fontLink = document.createElement('link');
                fontLink.id = 'dyslexia-font-link';
                fontLink.rel = 'stylesheet';
                fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic.css';
                document.head.appendChild(fontLink);
            }
        }
        
        // 6. Line height / Interlineado
        htmlEl.classList.remove('acc-line-height-1', 'acc-line-height-2');
        if (accessibilityState.lineHeight === 1) {
            htmlEl.classList.add('acc-line-height-1');
        } else if (accessibilityState.lineHeight === 2) {
            htmlEl.classList.add('acc-line-height-2');
        }
        
        // 7. Navegación por teclado focus highlight
        htmlEl.classList.remove('acc-focus-highlight');
        if (accessibilityState.focusHighlight === 1) {
            htmlEl.classList.add('acc-focus-highlight');
        }
        
        // 8. Actualizar interfaces
        updateUIElements();
        updateTranslations(accessibilityState.lang);
        applySiteTranslation(accessibilityState.lang);
    }

    // Cerrar y abrir el Drawer
    function openDrawer() {
        const drawer = document.getElementById('accessibility-drawer');
        const overlay = document.getElementById('accessibility-overlay');
        drawer.classList.add('open');
        overlay.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        
        window.lastActiveElement = document.activeElement;
        const closeBtn = document.getElementById('accessibility-close');
        if (closeBtn) closeBtn.focus();
        
        document.addEventListener('keydown', handleKeyPress);
    }

    function closeDrawer() {
        const drawer = document.getElementById('accessibility-drawer');
        const overlay = document.getElementById('accessibility-overlay');
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        
        if (window.lastActiveElement) {
            window.lastActiveElement.focus();
        }
        
        document.removeEventListener('keydown', handleKeyPress);
    }

    // Atrapar el foco en el menú (WCAG)
    function handleKeyPress(e) {
        const drawer = document.getElementById('accessibility-drawer');
        if (e.key === 'Escape') {
            closeDrawer();
            return;
        }
        
        if (e.key === 'Tab') {
            const focusables = drawer.querySelectorAll('select, button, a, [tabindex="0"]');
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }

    // Resetear a valores iniciales
    function resetToDefault() {
        accessibilityState = {
            lang: accessibilityState.lang, // preservar idioma
            profile: 'none',
            fontSize: 0,
            contrast: 0,
            cursor: 0,
            readingMask: 0,
            dyslexia: 0,
            lineHeight: 0,
            focusHighlight: 0
        };
        applySettings();
        saveState();
    }

    // Inicialización del Widget al cargar la página
    function init() {
        loadState();
        injectWidget();
        applySettings();
        
        // Agregar manejadores de eventos
        const fab = document.getElementById('accessibility-fab');
        const closeBtn = document.getElementById('accessibility-close');
        const overlay = document.getElementById('accessibility-overlay');
        const langSelect = document.getElementById('acc-lang-select');
        const profileSelect = document.getElementById('acc-profile-select');
        const resetBtn = document.getElementById('accessibility-reset');
        
        fab.addEventListener('click', openDrawer);
        closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);
        
        langSelect.addEventListener('change', function () {
            accessibilityState.lang = this.value;
            applySettings();
            saveState();
        });
        
        profileSelect.addEventListener('change', function () {
            const selectedProfile = this.value;
            if (selectedProfile !== 'none' && selectedProfile !== 'custom') {
                const pSettings = profiles[selectedProfile];
                for (let key in pSettings) {
                    accessibilityState[key] = pSettings[key];
                }
                accessibilityState.profile = selectedProfile;
            } else if (selectedProfile === 'none') {
                resetToDefault();
                return;
            } else if (selectedProfile === 'custom') {
                accessibilityState.profile = 'custom';
            }
            applySettings();
            saveState();
        });
        
        // Manejador de clics en las tarjetas
        const cards = document.querySelectorAll('.accessibility-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const type = card.getAttribute('data-type');
                const current = accessibilityState[type];
                const segments = parseInt(card.querySelector('.accessibility-bar').getAttribute('data-segments'), 10);
                const next = (current + 1) % (segments + 1);
                
                accessibilityState[type] = next;
                accessibilityState.profile = 'custom';
                applySettings();
                saveState();
            });
            
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
        
        resetBtn.addEventListener('click', resetToDefault);
    }
    
    // Iniciar el script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

