/* ============================================================
   INFALL — Auditoría responsive
   Se inyecta dentro de cada página y devuelve los problemas
   detectados en el viewport actual. Sin dependencias.

   Criterios: WCAG 2.2, Apple HIG (44pt) y Material (48dp).
   ============================================================ */
(function () {
    'use strict';

    var TAMANO_TOQUE = 44;      // mínimo del área táctil, en px CSS
    var SEPARACION_TOQUE = 8;   // separación mínima entre dos áreas táctiles
    var TEXTO_MINIMO = 12;      // por debajo de esto el texto no es legible
    var TEXTO_CUERPO = 16;      // menos de esto hace que iOS haga zoom en inputs

    function visible(el) {
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
        // Texto reservado a lectores de pantalla: no se ve, no se toca
        if (/(visually-hidden|sr-only|screen-reader|skip-link)/.test(el.className || '')) return false;
        if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return false;
        var r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return false;
        // Fuera del lienzo: cajones laterales cerrados, carruseles ocultos, etc.
        if (r.right <= 0 || r.left >= window.innerWidth) return false;
        return true;
    }

    function nombre(el) {
        var id = el.id ? '#' + el.id : '';
        var cls = '';
        if (el.className && typeof el.className === 'string') {
            cls = '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
        }
        var txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
        return el.tagName.toLowerCase() + id + cls + (txt ? ' «' + txt + '»' : '');
    }

    window.__infallAudit = function () {
        var W = window.innerWidth;
        var problemas = [];

        function anotar(tipo, gravedad, detalle, el) {
            problemas.push({
                tipo: tipo,
                gravedad: gravedad,          // 'alta' | 'media' | 'baja'
                detalle: detalle,
                elemento: el ? nombre(el) : ''
            });
        }

        /* ---- 1. Desbordamiento horizontal ---- */
        var anchoDoc = document.documentElement.scrollWidth;
        if (anchoDoc > W + 1) {
            anotar('scroll-horizontal', 'alta',
                'El documento mide ' + anchoDoc + 'px en un viewport de ' + W + 'px');

            // Quién lo provoca
            var culpables = [];
            var todos = document.querySelectorAll('body *');
            for (var i = 0; i < todos.length; i++) {
                var el = todos[i];
                if (!visible(el)) continue;
                var cs = getComputedStyle(el);
                if (cs.position === 'fixed') continue;
                var r = el.getBoundingClientRect();
                if (r.right > W + 1 && r.width > 24) {
                    // Solo el más externo de cada rama
                    var padre = el.parentElement;
                    var padreDesborda = padre && padre.getBoundingClientRect().right > W + 1;
                    if (!padreDesborda) {
                        culpables.push(nombre(el) + ' → ' + Math.round(r.right) + 'px');
                    }
                }
            }
            culpables.slice(0, 5).forEach(function (c) {
                anotar('scroll-horizontal-causa', 'alta', c);
            });
        }

        /* ---- 2. Áreas táctiles ---- */
        var vistosTactil = {};
        var tocables = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="tab"]');
        var cajas = [];
        for (var j = 0; j < tocables.length; j++) {
            var t = tocables[j];
            if (!visible(t)) continue;
            var rt = t.getBoundingClientRect();
            if (rt.bottom < 0 || rt.top > document.documentElement.scrollHeight) continue;

            cajas.push({ el: t, r: rt });

            // Enlaces dentro de un párrafo no cuentan: son texto corrido
            var enTexto = t.tagName === 'A' && t.parentElement &&
                /^(P|LI|SPAN|BLOCKQUOTE|FIGCAPTION|LABEL|TD)$/.test(t.parentElement.tagName);
            if (enTexto) continue;

            // Casilla o radio con etiqueta amplia: el objetivo real es la etiqueta
            if (/^(checkbox|radio)$/.test(t.type || '')) {
                var lab = t.id ? document.querySelector('label[for="' + t.id + '"]') : null;
                if (!lab && t.closest) lab = t.closest('label');
                if (lab && lab.getBoundingClientRect().height >= TAMANO_TOQUE - 0.5) continue;
            }

            if (rt.height < TAMANO_TOQUE - 0.5 || rt.width < TAMANO_TOQUE - 0.5) {
                var firma = nombre(t).split(' «')[0] + '|' + Math.round(rt.width) + 'x' + Math.round(rt.height);
                if (!vistosTactil[firma]) {
                    vistosTactil[firma] = 1;
                    anotar('area-tactil', rt.height < 32 || rt.width < 32 ? 'alta' : 'media',
                        Math.round(rt.width) + '×' + Math.round(rt.height) + 'px (mínimo ' + TAMANO_TOQUE + '×' + TAMANO_TOQUE + ')',
                        t);
                }
            }
        }

        /* ---- 3. Separación entre áreas táctiles ---- */
        for (var a = 0; a < cajas.length; a++) {
            for (var b = a + 1; b < cajas.length; b++) {
                var ra = cajas[a].r, rb = cajas[b].r;
                if (cajas[a].el.contains(cajas[b].el) || cajas[b].el.contains(cajas[a].el)) continue;

                var solapaX = ra.left < rb.right && rb.left < ra.right;
                var solapaY = ra.top < rb.bottom && rb.top < ra.bottom;
                var hx = solapaY ? (rb.left >= ra.right ? rb.left - ra.right : (ra.left >= rb.right ? ra.left - rb.right : -1)) : 999;
                var hy = solapaX ? (rb.top >= ra.bottom ? rb.top - ra.bottom : (ra.top >= rb.bottom ? ra.top - rb.bottom : -1)) : 999;
                var sep = Math.min(hx, hy);

                if (sep >= 0 && sep < SEPARACION_TOQUE) {
                    var par = nombre(cajas[a].el).split(' «')[0] + '~' + nombre(cajas[b].el).split(' «')[0];
                    if (vistosTactil['sep:' + par]) continue;
                    vistosTactil['sep:' + par] = 1;
                    anotar('separacion-tactil', 'baja',
                        Math.round(sep) + 'px entre ' + nombre(cajas[a].el) + ' y ' + nombre(cajas[b].el));
                }
            }
        }

        /* ---- 4. Tamaño de texto ---- */
        var textos = document.querySelectorAll('p, li, span, a, td, label, input, textarea, select, small, figcaption');
        var yaAvisado = {};
        for (var k = 0; k < textos.length; k++) {
            var tx = textos[k];
            if (!visible(tx)) continue;
            if (!(tx.textContent || '').trim() && !/^(INPUT|TEXTAREA|SELECT)$/.test(tx.tagName)) continue;

            var px = parseFloat(getComputedStyle(tx).fontSize);
            var clave = tx.tagName + '|' + (tx.className || '') + '|' + px;
            if (yaAvisado[clave]) continue;

            if (px < TEXTO_MINIMO) {
                yaAvisado[clave] = 1;
                anotar('texto-pequeno', 'media', px.toFixed(1) + 'px (mínimo ' + TEXTO_MINIMO + 'px)', tx);
            } else if (/^(INPUT|TEXTAREA|SELECT)$/.test(tx.tagName) && px < TEXTO_CUERPO &&
                       !/^(range|checkbox|radio|submit|button|file|color)$/.test(tx.type || '')) {
                yaAvisado[clave] = 1;
                anotar('input-zoom-ios', 'media',
                    px.toFixed(1) + 'px — iOS hará zoom al enfocar (mínimo ' + TEXTO_CUERPO + 'px)', tx);
            }
        }

        /* ---- 5. Imágenes sin dimensiones (salto de diseño) ---- */
        var imgs = document.querySelectorAll('img');
        for (var m = 0; m < imgs.length; m++) {
            var im = imgs[m];
            if (!visible(im)) continue;
            var tieneDim = im.hasAttribute('width') && im.hasAttribute('height');
            var cs2 = getComputedStyle(im);
            var tieneRatio = cs2.aspectRatio && cs2.aspectRatio !== 'auto';
            var padreFija = im.parentElement && getComputedStyle(im.parentElement).position === 'absolute';
            if (!tieneDim && !tieneRatio && !padreFija) {
                anotar('imagen-sin-dimension', 'media', 'sin width/height ni aspect-ratio: provoca CLS', im);
            }
        }

        /* ---- 6. Elementos fijos que tapan contenido ---- */
        var fijos = [];
        var cand = document.querySelectorAll('body *');
        for (var n = 0; n < cand.length; n++) {
            var f = cand[n];
            if (!visible(f)) continue;
            if (getComputedStyle(f).position !== 'fixed') continue;
            var rf = f.getBoundingClientRect();
            if (rf.width < 4 || rf.height < 4) continue;
            if (rf.width * rf.height > W * window.innerHeight * 0.6) continue; // velos a pantalla completa
            fijos.push({ el: f, r: rf });
        }
        for (var p = 0; p < fijos.length; p++) {
            for (var q = p + 1; q < fijos.length; q++) {
                var r1 = fijos[p].r, r2 = fijos[q].r;
                if (fijos[p].el.contains(fijos[q].el) || fijos[q].el.contains(fijos[p].el)) continue;
                if (r1.left < r2.right && r2.left < r1.right && r1.top < r2.bottom && r2.top < r1.bottom) {
                    anotar('fijos-solapados', 'media',
                        nombre(fijos[p].el) + ' se solapa con ' + nombre(fijos[q].el));
                }
            }
        }

        /* ---- 7. Viewport y zoom ---- */
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            anotar('viewport', 'alta', 'falta la etiqueta meta viewport');
        } else {
            var c = meta.getAttribute('content') || '';
            if (/user-scalable\s*=\s*no/.test(c) || /maximum-scale\s*=\s*1(\.0)?\b/.test(c)) {
                anotar('viewport', 'alta', 'el zoom está bloqueado: ' + c);
            }
        }

        /* ---- 8. Longitud de línea ---- */
        var parrafos = document.querySelectorAll('p');
        for (var s = 0; s < parrafos.length; s++) {
            var pr = parrafos[s];
            if (!visible(pr)) continue;
            var texto = (pr.textContent || '').trim();
            if (texto.length < 80) continue;
            // Medida real: caracteres ÷ número de líneas renderizadas
            var csP = getComputedStyle(pr);
            var lh = parseFloat(csP.lineHeight);
            if (!lh || isNaN(lh)) lh = parseFloat(csP.fontSize) * 1.5;
            var lineas = Math.max(1, Math.round(pr.getBoundingClientRect().height / lh));
            var chars = texto.length / lineas;
            if (chars > 75) {
                anotar('linea-larga', 'baja', Math.round(chars) + ' caracteres por línea (máximo 75)', pr);
                break;
            }
        }

        /* ---- 9. Retardo táctil ---- */
        var muestra = document.querySelector('a, button');
        var bodyTA = muestra ? getComputedStyle(muestra).touchAction : 'auto';
        if (bodyTA === 'auto') {
            anotar('touch-action', 'baja', 'sin touch-action: manipulation — 300 ms de retardo en navegadores antiguos');
        }

        /* ---- 10. Alto de viewport ---- */
        var hojas = Array.prototype.slice.call(document.styleSheets);
        var usa100vh = 0;
        hojas.forEach(function (h) {
            try {
                Array.prototype.slice.call(h.cssRules || []).forEach(function (r) {
                    if (r.style && (r.style.height === '100vh' || r.style.minHeight === '100vh')) usa100vh++;
                });
            } catch (e) { /* hoja externa */ }
        });
        if (usa100vh) {
            anotar('viewport-100vh', 'baja',
                usa100vh + ' regla(s) con 100vh — en móvil la barra del navegador lo corta; usar dvh');
        }

        return {
            url: location.pathname.split('/').pop() || 'index.html',
            ancho: W,
            alto: window.innerHeight,
            anchoDocumento: anchoDoc,
            problemas: problemas
        };
    };
})();
