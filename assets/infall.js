/* ============================================================
   INFALL — comportamiento de la home (2026)
   Sin dependencias. Todo degrada si falta un nodo.
   ============================================================ */
(function () {
    'use strict';

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const WA = '51908536493';

    /* ---- Tema claro / oscuro ---- */
    function initTheme() {
        const btn = $('#theme-toggle');
        if (!btn) return;
        const root = document.documentElement;
        const current = () => root.getAttribute('data-theme') || 'dark';
        btn.addEventListener('click', () => {
            const next = current() === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { /* modo privado */ }
            document.dispatchEvent(new Event('infall:theme'));
        });
    }

    /* ---- Luciérnagas: red de puntos a la deriva ---- */
    function initParticles() {
        const canvas = document.getElementById('page-particles');
        if (!canvas) return;
        if (reduced) { canvas.remove(); return; }

        const ctx = canvas.getContext('2d');
        let dots = [];
        let w = 0, h = 0;
        let raf = null;
        let visible = true;
        let mobile = window.innerWidth <= 768;
        let warm = '227, 155, 61';
        let glow = '242, 198, 140';

        function readPalette() {
            const cs = getComputedStyle(document.documentElement);
            warm = (cs.getPropertyValue('--amber-rgb') || warm).trim();
            glow = (cs.getPropertyValue('--accent-cyan-rgb') || glow).trim();
        }

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        function seed() {
            dots = [];
            const max = mobile ? 45 : 120;
            const divisor = mobile ? 14000 : 20000;
            const count = Math.min(max, Math.floor((w * h) / divisor));
            for (let i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 1.9 + 0.9,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.12,
                    alpha: Math.random() * 0.22 + 0.14,
                    pulse: Math.random() * Math.PI * 2,
                    tint: Math.random() < 0.3 ? 'glow' : 'warm'
                });
            }
        }

        function draw() {
            if (!visible) return;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                d.x += d.vx;
                d.y += d.vy;
                d.pulse += 0.015;

                if (d.x < 0) d.x = w;
                if (d.x > w) d.x = 0;
                if (d.y < 0) d.y = h;
                if (d.y > h) d.y = 0;

                const a = d.alpha * (0.7 + Math.sin(d.pulse) * 0.3);
                const rgb = d.tint === 'glow' ? glow : warm;

                ctx.beginPath();
                ctx.shadowBlur = d.size * 2.5;
                ctx.shadowColor = 'rgba(' + rgb + ',' + (a * 0.8) + ')';
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + rgb + ',' + a + ')';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Hilos entre luciérnagas cercanas
                for (let j = i + 1; j < dots.length; j++) {
                    const o = dots[j];
                    const dx = d.x - o.x;
                    const dy = d.y - o.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.strokeStyle = 'rgba(' + warm + ',' + (0.05 * (1 - dist / 130)) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            raf = requestAnimationFrame(draw);
        }

        readPalette();
        resize();
        seed();
        draw();

        document.addEventListener('infall:theme', readPalette);

        document.addEventListener('visibilitychange', () => {
            visible = !document.hidden;
            if (visible) {
                cancelAnimationFrame(raf);
                draw();
            }
        });

        let t = null;
        window.addEventListener('resize', () => {
            clearTimeout(t);
            t = setTimeout(() => {
                mobile = window.innerWidth <= 768;
                resize();
                seed();
            }, 200);
        });
    }

    /* ---- Barra de navegación ---- */
    function initNav() {
        const nav = $('#nav');
        if (nav) {
            const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        const burger = $('#nav-burger');
        const links = $('#nav-links');
        const scrim = $('#nav-scrim');
        if (!burger || !links) return;

        const setOpen = (open) => {
            burger.classList.toggle('is-open', open);
            links.classList.toggle('is-open', open);
            if (scrim) scrim.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };

        burger.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
        if (scrim) scrim.addEventListener('click', () => setOpen(false));
        $$('a', links).forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    }

    /* ---- Reveals al hacer scroll ---- */
    function initReveal() {
        const items = $$('.reveal');
        if (!items.length) return;
        if (reduced || !('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('is-in'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
        items.forEach(el => io.observe(el));
    }

    /* ---- Carrusel del hero: captura + ficha del proyecto ---- */
    function initHeroCarousel() {
        const root = $('#hero-carousel');
        if (!root) return;
        const shots = $$('.shot', root);
        const dotsBox = $('#hero-dots');
        if (shots.length < 2 || !dotsBox) return;

        const url = $('#hero-url');
        const count = $('#hero-count');
        const PAUSA = 5000;

        let i = 0;
        let timer = null;

        const dots = shots.map((shot, n) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'shots__dot';
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-label', 'Ver ' + (shot.dataset.cliente || 'proyecto ' + (n + 1)));
            b.addEventListener('click', () => { show(n); restart(); });
            dotsBox.appendChild(b);
            return b;
        });

        function show(n) {
            i = (n + shots.length) % shots.length;
            const shot = shots[i];
            shots.forEach((s, k) => s.classList.toggle('is-on', k === i));
            dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === i)));
            if (url) url.textContent = shot.dataset.url || '';
            if (count) count.textContent = String(i + 1).padStart(2, '0');
        }

        function restart() {
            clearInterval(timer);
            if (reduced) return;
            timer = setInterval(() => show(i + 1), PAUSA);
        }

        // El teclado recorre los proyectos con las flechas
        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { show(i + 1); restart(); }
            if (e.key === 'ArrowLeft') { show(i - 1); restart(); }
        });

        root.addEventListener('mouseenter', () => clearInterval(timer));
        root.addEventListener('mouseleave', restart);
        root.addEventListener('focusin', () => clearInterval(timer));
        root.addEventListener('focusout', restart);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(timer); else restart();
        });

        show(0);
        restart();
    }

    /* ---- Modal: ¿quieres dominio con tu plan? ---- */
    function initPlanModal() {
        const modal = $('#domainPromptModal');
        if (!modal) return;
        const nameEl = $('#promptPlanName');
        let plan = { name: '', price: 0 };

        const open = () => modal.classList.remove('hidden');
        const close = () => modal.classList.add('hidden');

        $$('.js-plan-cta').forEach(btn => {
            btn.addEventListener('click', () => {
                plan.name = btn.dataset.planName || '';
                plan.price = Number(btn.dataset.planPrice || 0);
                if (window.InfallCart) window.InfallCart.setPlan(plan.name, plan.price);
                if (nameEl) nameEl.textContent = plan.name;
                open();
            });
        });

        const closeBtn = $('#closeDomainPrompt');
        if (closeBtn) closeBtn.addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        const yes = $('#btnYesDomain');
        if (yes) yes.addEventListener('click', () => { window.location.href = 'dominios.html?fromPlan=1'; });

        const no = $('#btnNoDomain');
        if (no) no.addEventListener('click', () => {
            let msg = 'Hola INFALL, quiero el plan ' + plan.name + ' (desde S/ ' + plan.price + '). ¿Me ayudan a empezar?';
            if (window.InfallCart) {
                const cart = window.InfallCart.get();
                const saved = cart.domain;
                window.InfallCart.removeDomain();
                msg = window.InfallCart.buildMessage();
                if (saved) window.InfallCart.setDomain(saved.name, saved.years, saved.price);
            }
            window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
            close();
        });
    }

    /* ---- Formulario "propuesta a tu medida" → WhatsApp ---- */
    function initBriefForm() {
        const form = $('#brief-form');
        if (!form) return;
        const range = $('#brief-budget');
        const out = $('#brief-budget-value');

        const fmt = (n) => 'S/ ' + Number(n).toLocaleString('es-PE');
        if (range && out) {
            const sync = () => { out.textContent = fmt(range.value); };
            sync();
            range.addEventListener('input', sync);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = ($('#brief-name', form) || {}).value || '';
            const need = ($('#brief-need', form) || {}).value || '';
            if (!name.trim() || !need.trim()) {
                form.reportValidity();
                return;
            }
            const budget = range ? fmt(range.value) : 'a conversar';
            const msg =
                'Hola INFALL, soy ' + name.trim() + '.\n' +
                'Necesito: ' + need.trim() + '\n' +
                'Presupuesto ideal: ' + budget;
            window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        });
    }

    /* ---- Arranque ---- */
    function init() {
        initTheme();
        initParticles();
        initNav();
        initReveal();
        initHeroCarousel();
        initPlanModal();
        initBriefForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
