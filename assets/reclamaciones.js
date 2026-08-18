/* ============================================================
   INFALL — Libro de Reclamaciones
   Registra la solicitud, genera el número de hoja y la envía
   al correo de la empresa. Guarda una copia local por si el
   envío falla, para no perder el caso.
   ============================================================ */
(function () {
    'use strict';

    var form = document.getElementById('claim-form');
    if (!form) return;

    var CORREO = 'infallcm@gmail.com';
    var msg = document.getElementById('cl-msg');
    var btn = document.getElementById('cl-enviar');

    function avisar(texto, tipo) {
        if (!msg) return;
        msg.textContent = texto;
        msg.className = 'claim__msg ' + tipo;
    }

    // Número de hoja correlativo: año + secuencia local
    function numeroHoja() {
        var anio = new Date().getFullYear();
        var clave = 'infallHoja' + anio;
        var n = 1;
        try {
            n = parseInt(localStorage.getItem(clave) || '0', 10) + 1;
            localStorage.setItem(clave, String(n));
        } catch (e) { n = Math.floor(Math.random() * 9000) + 1000; }
        return anio + '-' + String(n).padStart(4, '0');
    }

    function correoValido(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function guardarCopia(datos) {
        try {
            var previas = JSON.parse(localStorage.getItem('infallReclamos') || '[]');
            previas.push(datos);
            localStorage.setItem('infallReclamos', JSON.stringify(previas));
        } catch (e) { /* modo privado */ }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var v = function (id) {
            var el = document.getElementById(id);
            return el ? String(el.value || '').trim() : '';
        };

        var nombre = v('cl-nombre');
        var doc = v('cl-doc');
        var correo = v('cl-email');
        var tel = v('cl-tel');
        var domicilio = v('cl-dir');
        var detalle = v('cl-detalle');
        var pedido = v('cl-pedido');
        var acepta = document.getElementById('cl-acepta');

        if (!nombre || !doc || !correo || !tel || !domicilio || !detalle || !pedido) {
            avisar('Completa todos los campos obligatorios para poder registrar tu solicitud.', 'err');
            return;
        }
        if (!correoValido(correo)) {
            avisar('Revisa tu correo electrónico: ahí te enviaremos la respuesta.', 'err');
            return;
        }
        if (acepta && !acepta.checked) {
            avisar('Necesitamos tu autorización para tratar los datos y poder atender el caso.', 'err');
            return;
        }

        var hoja = numeroHoja();
        var tipo = v('cl-tipo') || 'reclamo';
        var fecha = new Date().toLocaleString('es-PE');

        var datos = {
            'Hoja N°': hoja,
            'Fecha': fecha,
            'Tipo': tipo === 'queja' ? 'QUEJA' : 'RECLAMO',
            'Nombre': nombre,
            'Documento': doc,
            'Correo': correo,
            'Teléfono': tel,
            'Domicilio': domicilio,
            'Padre o tutor': v('cl-tutor') || 'No aplica',
            'Tipo de bien': v('cl-tipo-bien'),
            'Monto reclamado': v('cl-monto') || 'No indicado',
            'Descripción del bien': v('cl-desc-bien'),
            'Detalle': detalle,
            'Pedido del consumidor': pedido,
            _subject: 'LIBRO DE RECLAMACIONES — Hoja ' + hoja + ' (' + tipo + ')',
            _captcha: 'false'
        };

        guardarCopia(datos);

        var textoOriginal = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Registrando…'; }

        fetch('https://formsubmit.co/ajax/' + CORREO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(function (r) { return r.json(); })
            .then(function () {
                avisar('Tu solicitud quedó registrada con la hoja N° ' + hoja +
                    '. Te responderemos al correo indicado en un plazo máximo de 15 días hábiles. ' +
                    'Anota este número para cualquier seguimiento.', 'ok');
                form.reset();
                if (window.InfallStats) window.InfallStats.registrar('reclamo_registrado', { tipo: tipo });
            })
            .catch(function () {
                avisar('Registramos tu solicitud con la hoja N° ' + hoja +
                    ', pero no pudimos enviarla automáticamente. Escríbenos a ' + CORREO +
                    ' citando ese número, o por WhatsApp al +51 908 536 493.', 'err');
            })
            .then(function () {
                if (btn) { btn.disabled = false; btn.innerHTML = textoOriginal; }
            });
    });
})();
