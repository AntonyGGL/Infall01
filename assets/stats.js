/* ============================================================
   INFALL — Calificación de la portada, siempre al día
   Promedia las estrellas (--r) de las reseñas visibles de la
   sección de opiniones. Para actualizar: agrega la reseña en
   index.html. No hay que tocar este archivo.
   ============================================================ */
(function () {
    'use strict';

    function poner(nombre, valor) {
        document.querySelectorAll('[data-stat="' + nombre + '"]').forEach(function (e) { e.textContent = valor; });
    }

    var notas = [].map.call(document.querySelectorAll('.rv__card:not([aria-hidden="true"]) .tm__stars'), function (s) {
        return parseFloat(s.style.getPropertyValue('--r') || getComputedStyle(s).getPropertyValue('--r'));
    }).filter(function (n) { return !isNaN(n); });

    if (!notas.length) return;
    var prom = notas.reduce(function (a, n) { return a + n; }, 0) / notas.length;
    poner('promedio', prom.toFixed(1).replace('.', ','));
    poner('opiniones', notas.length);
    document.querySelectorAll('[data-stars]').forEach(function (e) { e.style.setProperty('--r', prom.toFixed(2)); });
})();
