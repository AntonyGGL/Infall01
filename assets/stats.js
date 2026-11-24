/* ============================================================
   INFALL — Números de la portada, siempre al día
   - Webs publicadas y rubros: se cuentan desde portfolio.html
     (cada <article class="pw"> es un proyecto; el rubro es el
     texto de .pw__kind antes del "·").
   - Opiniones: tarjetas de reseña visibles en esta página.
   - Años: se calculan desde el año de inicio.
   Para actualizar: agrega el proyecto en portfolio.html y la
   reseña en index.html. No hay que tocar este archivo.
   ============================================================ */
(function () {
    'use strict';

    var INICIO = 2022; // año en que empezaste a crear software

    function poner(nombre, valor) {
        document.querySelectorAll('[data-stat="' + nombre + '"]').forEach(function (el) {
            el.textContent = valor;
        });
    }

    // Años de experiencia
    var anos = new Date().getFullYear() - INICIO;
    if (anos > 0) poner('anos', anos + '+');

    // Opiniones visibles (las copias del carrusel llevan aria-hidden)
    var opiniones = document.querySelectorAll('.rv__card:not([aria-hidden="true"])').length;
    if (opiniones) poner('opiniones', opiniones);

    // Proyectos y rubros desde el portafolio
    if (!window.fetch || !window.DOMParser) return;
    fetch('portfolio.html', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
        .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var proyectos = doc.querySelectorAll('article.pw');
            if (!proyectos.length) return;
            poner('proyectos', proyectos.length);

            var rubros = [];
            proyectos.forEach(function (p) {
                var k = p.querySelector('.pw__kind');
                if (!k) return;
                var r = k.textContent.split('·')[0].trim();
                if (r && rubros.indexOf(r) === -1) rubros.push(r);
            });
            if (rubros.length) {
                poner('rubros', rubros.length);
                var lista = rubros.slice(0, 3).map(function (r) { return r.toLowerCase(); }).join(', ');
                poner('rubros-lista', lista + (rubros.length > 3 ? ' y más' : ''));
            }
        })
        .catch(function () { /* se quedan los números escritos en el HTML */ });
})();
