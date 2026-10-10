# Despliegue Académico: Aplicaciones Web

Esta configuración publica una demostración con JSON Server, no un backend seguro. Solo deben utilizarse datos y contraseñas ficticios. Los datos del mock son compartidos y sus endpoints públicos permiten modificarlos. No introducir información de entrevistas ni vehículos reales.

## Render: Fake RESTful API

La API simulada vive en el repositorio separado `fleetproof-mock-platform` de la organización upc-pre-202620-asi0730-8088-blip, rama `feature/sprint2-mock-api`. Servicio publicado: https://fleetproof-mock-platform.onrender.com.

Crear un Web Service manualmente, con el plan Free, desde ese repositorio y rama.

- Runtime: Node.
- Build command: `npm ci`.
- Start command: `npm start`.
- Health check path: `/api/v1/health`.
- Variables: `HOST=0.0.0.0` y `NODE_VERSION=24.21.0`.
- PORT: usar el valor suministrado por Render, sin fijarlo manualmente.
- No añadir discos, bases de datos pagas ni tarjeta.

Verificar GET en la URL HTTPS asignada por Render con `/api/v1/health`. Los demás recursos, como `/api/v1/vehicles`, requieren el token obtenido en `POST /api/v1/authentication/sign-in` y responden 401 sin él. Esta API permite CORS mediante los middlewares de JSON Server.

El plan gratuito puede dormir después de 15 minutos sin tráfico. La primera petición puede tardar aproximadamente un minuto; abrir el health check antes de la demostración y esperar una respuesta correcta. El archivo db.json se reinicia al redesplegar o reiniciar el servicio. No constituye persistencia durable.

## Netlify: Frontend Vue

Crear un proyecto del plan Free desde el repositorio `fleetproof-webapp`, rama `main` (las versiones llegan a `main` mediante ramas `release/*`). netlify.toml contiene build, carpeta de publicación, Node y redirección SPA.

Configurar en las variables de build:

- `VITE_FLEETPROOF_API_URL=https://fleetproof-mock-platform.onrender.com/api/v1`. Nunca localhost para el despliegue público; el build falla a propósito si la URL no es HTTPS pública.
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
- [ ] Recargar rutas internas sirve index.html y conserva la sesión guardada; si Render se reinició, el token deja de ser válido y la app redirige a login.
- [ ] Revisar móvil y escritorio, consola y solicitudes fallidas.
- [ ] Capturar URLs, commit, pruebas y fecha como evidencias reales, solo después del despliegue.

Documentación oficial: https://render.com/docs/web-services, https://render.com/docs/free y https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/.
