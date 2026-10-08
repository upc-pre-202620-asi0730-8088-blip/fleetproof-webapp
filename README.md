# BLIP | FleetProof Frontend

Primera implementación local de la aplicación web para 1ASI0730 Aplicaciones Web.

## Ejecución en WebStorm

Abra esta carpeta con File > Open. Seleccione Node.js 24.20 o superior como runtime.
Ejecute `npm ci`. En dos terminales de WebStorm:

```sh
npm run server
npm run dev
```

API local: http://localhost:3000/api/v1. Aplicación: http://localhost:5173.
Las variables opcionales se documentan en .env.example; los valores predeterminados permiten ejecutar ambos procesos sin crear archivos adicionales.

## Base de clase

Se reutilizan BaseEndpoint y las clases MockApiServer y MockApiServerConfig de los proyectos Learning Center proporcionados por el equipo.
BaseApi, entidades, assemblers, stores de Pinia y rutas siguen la estructura de learning-center-guide.md.
Vue, PrimeVue (Material), PrimeFlex, PrimeIcons, Axios, Vue Router e i18n siguen las herramientas de la guía.
JSON Server permanece en la versión estable 0.17.4 porque el servidor de clase utiliza create, router y rewriter, incompatibles con la versión 1 beta.
Las versiones quedan fijadas en package.json y package-lock.json.

## Alcance

Dashboard, registro y edición de vehículos, búsqueda y filtros, solicitud de reportes, checklist con fuente/fecha/evidencia y casos con cierre respaldado.
Los datos de mock-api/db.json son simulados. No existen consultas a fuentes oficiales ni cobros.
Registro, inicio y cierre de sesión, authenticationGuard e iamInterceptor reutilizan el patrón IAM de la guía. FakeSignInEndpoint y sus comandos, recursos y assemblers se extraen directamente de la guía.
La autenticación es simulada: JSON Server almacena contraseñas de prueba sin cifrado. Utilice únicamente credenciales ficticias, nunca contraseñas personales. La API exige tokens aleatorios y filtra recursos por propietario. No sustituye un backend de producción ni implementa los roles de analista y supervisor.
En producción IamApi utiliza el endpoint real de autenticación como indica la guía; el despliegue necesita ese backend.
Para la entrega con Fake API, establecer explícitamente VITE_AUTH_MODE=mock permite utilizar el adapter ficticio también en el build. No implica autenticación segura.
PrimeVue 5 requiere una licencia personal en VITE_PRIME_UI_LICENSE_KEY dentro de .env.local. No se copia la clave de ejemplo del profesor.
Cuenta administradora de demostración: usuario `etepepe`, contraseña `12345678`. Se crea al iniciar la API; no puede eliminarse ni cambiar de nombre. Su contraseña se restablece al reiniciar. Las cuentas nuevas empiezan sin los registros del administrador.
La revisión del reporte es una acción funcional del prototipo; no valida información oficial ni constituye autorización por rol.

## Personalización y reportes

Flota reúne vehículos y gestión de flotas. Perfil permite cambiar nombre, cambiar contraseña validando la actual y eliminar la cuenta con sus recursos mediante confirmación. Cambiar contraseña invalida todas las sesiones.

Los reportes contienen únicamente Consulta Vehicular, SOAT y SBS Accidentes con datos ficticios. El flujo es borrador, revisado y publicado; solo los publicados permiten descargar PDF. jsPDF genera el documento y Papa Parse procesa CSV. El CSV requiere `plate,type,site,owner`; `risk` es opcional (`high`, `medium`, `low`). Se identifican filas inválidas y duplicadas, conservando los registros válidos.

Cuotas provisionales de demostración: 50 vehículos, 100 reportes y 25 monitoreos activos por cuenta. La API rechaza operaciones que exceden esas cuotas. No se procesan pagos reales. Las acciones nuevas de perfil requieren actualizar las historias y el Sprint Backlog del informe.

## Diseño

Paleta, Manrope/Inter, distribución de flota, reportes y casos basados en el Capítulo IV del informe de Aplicaciones Web.
El logo se reutiliza desde los assets del reporte.
Los indicadores se calculan a partir de los registros persistidos.

## Verificación

`npm run build` genera dist. No se agregan Playwright ni herramientas de pruebas ajenas a la guía.
La API simulada se ejecuta únicamente en localhost y no debe exponerse como servicio de producción.
Antes de desplegar debe integrarse autenticación/autorización y configurar VITE_FLEETPROOF_API_URL.

## Control de versiones

Rama local inicial: feature/sprint2-frontend-foundation. Repositorio remoto inicialmente vacío.
La inicialización de main/develop y publicación se coordinarán con el equipo antes de integrar nuevas historias.
Los cambios posteriores se desarrollan en feature por historia y se integran mediante Pull Request a develop.

## Bounded Contexts del Capítulo IV

El programa organiza el alcance local en los seis contextos del informe. Cada módulo conserva las capas domain, application, infrastructure y presentation de la guía.

| Contexto del reporte | Módulo | Responsabilidad implementada |
| --- | --- | --- |
| User Management | user-management | Registro y autenticación simulada, sesión y guard de rutas. |
| Subscription Management | subscription-management | Solicitud de servicios y estados de pago simulado. Solo un pago completado activa la suscripción. |
| Vehicle Information | vehicle-information | Registro y edición de vehículos, placas, búsqueda y datos locales. |
| Report Management | report-management | Solicitud, checklist, trazabilidad de evidencias y revisión de reportes locales. |
| Vehicle Monitoring | vehicle-monitoring | Programación por intervalo, snapshots, detección de cambios y alertas persistidas. |
| Fleet Management | fleet-management | Flotas, asignaciones, responsables, riesgo por vehículo y casos con cierre respaldado. |

Los casos antes ubicados en resolution pertenecen ahora a Fleet Management; no se introduce un séptimo contexto. El estado de monitoreo mostrado por el dashboard y la lista de vehículos procede de Vehicle Monitoring, no de una casilla editable del vehículo. Las relaciones entre contextos utilizan identificadores y recursos explícitos mediante assemblers. Los imports anteriores fueron actualizados, manteniendo las URLs existentes de vehículos, reportes y casos.

Flotas y monitoreo requieren una suscripción activa del servicio correspondiente. El mock comparte sus datos entre usuarios y no ofrece autorización real; esa validación local no sustituye controles del backend.

## Límites Pendientes del Backend

La separación de los seis contextos no implica que todas las funcionalidades del informe estén terminadas. Taypi, roles y autorización del servidor, consultas a fuentes oficiales y sus reintentos, reportes oficiales completos/de tránsito/SUNARP y notificaciones externas siguen pendientes.

El monitoreo compara datos de JSON Server. Mientras su vista permanece abierta, revisa cada 15 segundos si venció el intervalo configurado y realiza la comparación correspondiente; también permite una revisión manual. Al cerrar la vista se detiene el temporizador. No reemplaza el MonitoringBackgroundWorker del servidor descrito en el reporte ni garantiza ejecución con el navegador cerrado.

Los registros de demostración de suscripciones, flota, asignación y alertas son ficticios. Se verificaron pago fallido sin activación, pago completado con activación, asignación de responsable, revisión sin cambios y alerta con valores anteriores y nuevos.

## Despliegue de la Demostración

Consultar [configuración de Render y Netlify](docs/deployment.md). Netlify no debe apuntar a localhost; el build valida la URL HTTPS cuando se ejecuta en esa plataforma. La API conserva el host local por defecto y admite HOST=0.0.0.0 para Render. Esta preparación no acredita que el despliegue público ya se haya realizado.
