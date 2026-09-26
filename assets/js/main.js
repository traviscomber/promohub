/* PromoHub Chile — interacciones ligeras (sin dependencias) */
(function () {
  "use strict";

  /* Menú móvil */
  var boton = document.querySelector(".boton-menu");
  var nav = document.querySelector(".nav-principal");
  if (boton && nav) {
    boton.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  /* Año actual en el pie de página */
  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Newsletter (demo local: confirma sin enviar a servidor) */
  var formNews = document.querySelector(".formulario-newsletter");
  if (formNews) {
    formNews.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = formNews.querySelector("input[type=email]");
      var mensaje = document.querySelector(".mensaje-form");
      if (email && email.value.indexOf("@") > 0) {
        if (mensaje) mensaje.textContent = "¡Listo! Te avisaremos cuando haya nuevas ofertas. 📩";
        formNews.reset();
      } else if (mensaje) {
        mensaje.textContent = "Ingresa un correo válido para suscribirte.";
      }
    });
  }

  /* Formulario de acceso (cuentas aún no disponibles) */
  var formAuth = document.querySelector("[data-auth]");
  if (formAuth) {
    formAuth.addEventListener("submit", function (e) {
      e.preventDefault();
      var mensaje = document.querySelector(".mensaje-form");
      if (mensaje) mensaje.textContent = "Las cuentas de usuario llegarán muy pronto. ¡Vuelve a visitarnos!";
    });
  }
})();
