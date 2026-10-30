/* ===== Ombú Café — comportamiento ===== */
(function () {
  'use strict';

  /* ---------- Menú hamburguesa ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu-principal');

  function cerrarMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', String(abierto));
      toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cerrarMenu(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 800) cerrarMenu();
    });
  }

  /* ---------- Transición entre páginas ---------- */
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('a[href]');
    if (!enlace) return;
    var destino = enlace.getAttribute('href');
    var esPagina = /\.html(#.*)?$/.test(destino) && enlace.origin === location.origin && !enlace.target;
    var mismaPagina = enlace.pathname === location.pathname;
    if (!esPagina || mismaPagina || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    document.body.classList.add('saliendo');
    setTimeout(function () { window.location.href = enlace.href; }, 280);
  });
  // Si se vuelve con "atrás", quitar el estado de salida
  window.addEventListener('pageshow', function () {
    document.body.classList.remove('saliendo');
  });

  /* ---------- Año del pie ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Formulario de reservas ---------- */
  var reserva = document.getElementById('form-reserva');
  if (reserva) {
    var fecha = document.getElementById('fecha');
    var hoy = new Date();
    fecha.min = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

    reserva.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('mensaje-reserva');
      var nombre = document.getElementById('nombre').value.trim();
      var hora = document.getElementById('hora').value;
      var personas = document.getElementById('personas').value;

      if (nombre.length < 2 || !fecha.value) {
        msg.textContent = 'Completá tu nombre y elegí una fecha.';
        msg.className = 'mensaje error';
        return;
      }
      var p = fecha.value.split('-');
      msg.textContent = 'Listo, ' + nombre + '. Reservamos para ' + personas + ' el ' + p[2] + '/' + p[1] + '/' + p[0] + ' a las ' + hora + '.';
      msg.className = 'mensaje ok';
      reserva.reset();
    });
  }

  /* ---------- Formulario de login ---------- */
  var login = document.getElementById('form-login');
  if (login) {
    var clave = document.getElementById('clave');
    var ver = document.getElementById('ver-clave');

    ver.addEventListener('click', function () {
      var oculta = clave.type === 'password';
      clave.type = oculta ? 'text' : 'password';
      ver.textContent = oculta ? 'Ocultar' : 'Mostrar';
      ver.setAttribute('aria-pressed', String(oculta));
    });

    login.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('mensaje-login');
      var email = document.getElementById('email').value.trim();
      var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValido) {
        msg.textContent = 'Escribí un correo válido, por ejemplo nombre@correo.com.';
        msg.className = 'mensaje error';
        return;
      }
      if (clave.value.length < 6) {
        msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        msg.className = 'mensaje error';
        return;
      }
      msg.textContent = 'Sesión iniciada. Te llevamos a la carta.';
      msg.className = 'mensaje ok';
      setTimeout(function () { window.location.href = 'index.html#carta'; }, 900);
    });
  }
})();
