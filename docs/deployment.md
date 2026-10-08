# Despliegue Académico: Aplicaciones Web

Esta configuración publica una demostración con JSON Server, no un backend seguro. Solo deben utilizarse datos y contraseñas ficticios. Los datos del mock son compartidos y sus endpoints públicos permiten modificarlos. No introducir información de entrevistas ni vehículos reales.

## Render: Fake RESTful API

Crear un Web Service manualmente, con el plan Free, desde el repositorio blip-fleetproof-frontend de la organización 1ASI0730-8088-Blit. Seleccionar la rama feature/sprint2-frontend-foundation.

- Runtime: Node.
- Build command: `npm ci --include=dev`.
- Start command: `npm run server`.
- Health check path: `/api/v1/health`.
- Variables: `HOST=0.0.0.0` y `NODE_VERSION=24.21.0`.
- PORT: usar el valor suministrado por Render, sin fijarlo manualmente.
- No añadir discos, bases de datos pagas ni tarjeta.

Verificar GET en la URL HTTPS asignada por Render, con `/api/v1/health` y `/api/v1/vehicles`. Esta API permite CORS mediante los middlewares de JSON Server.

El plan gratuito puede dormir después de 15 minutos sin tráfico. La primera petición puede tardar aproximadamente un minuto; abrir el health check antes de la demostración y esperar una respuesta correcta. El archivo db.json se reinicia al redesplegar o reiniciar el servicio. No constituye persistencia durable.

## Netlify: Frontend Vue

Crear un proyecto del plan Free desde el mismo repositorio y rama. netlify.toml contiene build, carpeta de publicación, Node y redirección SPA.

Configurar en las variables de build:

- `VITE_FLEETPROOF_API_URL`: la URL real de Render seguida de `/api/v1`, con HTTPS. Nunca localhost para el despliegue público.
- `VITE_AUTH_MODE=mock`: autenticación ficticia mediante el adapter de la guía, incluso en el build publicado. El modo real requiere otro backend.
- `VITE_PRIME_UI_LICENSE_KEY`: licencia personal válida. No usar la clave de ejemplo del profesor ni incluirla en Git.

Cambiar variables requiere volver a compilar y desplegar. No comprar dominio ni activar upgrades. Usar el subdominio gratuito.

## Verificación de la Entrega

- [ ] API HTTPS responde y muestra datos ficticios.
- [ ] Frontend HTTPS utiliza la API pública, no localhost.
- [ ] Inicio de sesión con fleetproof.test / Ficticia123! funciona.
- [ ] Registro con credenciales ficticias y cierre de sesión funcionan.
- [ ] Registro/edición de vehículos, reporte, evidencias y casos conservan sus flujos.
- [ ] Suscripciones, flotas y monitoreo funcionan contra el mock público.
- [ ] Recargar rutas internas sirve index.html; el guard puede redirigir a login porque la sesión en memoria no se restaura.
- [ ] Revisar móvil y escritorio, consola y solicitudes fallidas.
- [ ] Capturar URLs, commit, pruebas y fecha como evidencias reales, solo después del despliegue.

Documentación oficial: https://render.com/docs/web-services, https://render.com/docs/free y https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/.
