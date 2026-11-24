/* ============================================================
   INFALL — Medición
   Un solo lugar donde se declara la cuenta y se marcan las
   conversiones. Sin ID configurado no carga nada ni rastrea.
   ============================================================ */
(function () {
    'use strict';

    /* ---- Configuración ----------------------------------------------------
       Pega aquí el identificador de tu propiedad de GA4 (formato G-XXXXXXXXXX).
       Lo obtienes en analytics.google.com → Administrar → Flujos de datos.
       Mientras esté vacío, el sitio no carga Google Analytics ni envía datos.
    ----------------------------------------------------------------------- */
    /* GA4 ya se carga con la etiqueta de Google del <head> (GTM-P2N5VG5D →
       G-Y2P1C2S4NZ). Deja esto vacío para no medir cada visita dos veces. */
    var GA4_ID = '';

    var activo = /^G-[A-Z0-9]{6,}$/i.test(GA4_ID);

    /* ---- Carga de GA4 ---- */
    if (activo) {
        var tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
        document.head.appendChild(tag);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA4_ID, { anonymize_ip: true });
    }

    /* ---- Registro de conversiones ----
       Funciona con o sin GA4: sin cuenta configurada guarda un resumen local
       que puedes leer en la consola con InfallStats.ver().
    ---------------------------------------------------------------------- */
    var CLAVE = 'infallEventos';

    function registrar(nombre, datos) {
        datos = datos || {};
        datos.pagina = location.pathname.split('/').pop() || 'index.html';

        // La etiqueta de Google (GTM-P2N5VG5D) va en el <head> de cada página
        // y define window.gtag; los eventos llegan a GA4 por ahí.
        if (typeof window.gtag === 'function') {
            window.gtag('event', nombre, datos);
        }

        try {
            var log = JSON.parse(localStorage.getItem(CLAVE) || '{}');
            log[nombre] = (log[nombre] || 0) + 1;
            localStorage.setItem(CLAVE, JSON.stringify(log));
        } catch (e) { /* modo privado */ }
    }

    window.InfallStats = {
        registrar: registrar,
        ver: function () {
            try { return JSON.parse(localStorage.getItem(CLAVE) || '{}'); }
            catch (e) { return {}; }
        },
        limpiar: function () {
            try { localStorage.removeItem(CLAVE); } catch (e) { }
        }
    };

    /* ---- Qué se considera conversión ---- */
    function init() {
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a, button');
            if (!a) return;

            var href = a.getAttribute('href') || '';

            // Contacto por WhatsApp: la conversión principal del negocio
            if (href.indexOf('wa.me') > -1) {
                registrar('contacto_whatsapp', {
                    origen: a.className || 'enlace',
                    numero: (href.match(/wa\.me\/(\d+)/) || [])[1] || ''
                });
                return;
            }

            if (href.indexOf('mailto:') === 0) { registrar('contacto_correo'); return; }
            if (href.indexOf('tel:') === 0) { registrar('contacto_telefono'); return; }

            // Plan añadido al carrito
            if (a.matches('.js-plan-cta, .open-domain-prompt')) {
                registrar('plan_seleccionado', {
                    plan: a.dataset.planName || '',
                    precio: Number(a.dataset.planPrice || 0)
                });
                return;
            }

            // Salida hacia un trabajo entregado
            if (a.matches('.pj, .btn-visitar, .btn-visitar-project')) {
                registrar('portafolio_visita', { destino: href });
            }
        }, true);

        // Formularios enviados
        document.addEventListener('submit', function (e) {
            var f = e.target;
            if (!f || f.tagName !== 'FORM') return;
            registrar('formulario_enviado', { formulario: f.id || 'sin-id' });
        }, true);

        // Búsqueda de dominios
        var buscador = document.getElementById('domainSearchForm') || document.querySelector('.ds-form');
        if (buscador) {
            buscador.addEventListener('submit', function () { registrar('dominio_buscado'); });
        }

        // Profundidad de lectura: señal de interés real
        var hitos = { 50: false, 90: false };
        window.addEventListener('scroll', function () {
            var alto = document.documentElement.scrollHeight - window.innerHeight;
            if (alto <= 0) return;
            var pct = (window.scrollY / alto) * 100;
            for (var h in hitos) {
                if (!hitos[h] && pct >= Number(h)) {
                    hitos[h] = true;
                    registrar('scroll_' + h);
                }
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
