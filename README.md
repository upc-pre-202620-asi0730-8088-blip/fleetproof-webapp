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
La autenticación es simulada y local: JSON Server almacena contraseñas de prueba sin cifrado. Utilice únicamente credenciales ficticias, nunca contraseñas personales. No existe autorización por rol en el servidor.
En producción IamApi utiliza el endpoint real de autenticación como indica la guía; el despliegue necesita ese backend.
PrimeVue 5 requiere una licencia personal en VITE_PRIME_UI_LICENSE_KEY dentro de .env.local. No se copia la clave de ejemplo del profesor.
Cuenta ficticia para la verificación local: usuario `fleetproof.test`, contraseña `Ficticia123!`.
La revisión del reporte es una acción funcional del prototipo; no valida información oficial ni constituye autorización por rol.

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
