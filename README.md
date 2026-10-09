# FleetProof Web Application

Aplicaciones Web · 1ASI0730 · NRC 8088 · BLIP.

Base Vue / Vite, PrimeVue, Pinia e i18n. Sin archivos de los seis bounded contexts ni servidor mock. Se conserva el historial de preparación original; incorporar código existente no cambia su autoría original.

## Ejecución

`npm ci`, `npm run dev`, `npm run build`.

## Ramas

- `main`: base estable.
- `develop`: integración mediante PR.
- `feature/fleet-and-report-management`: Sebastian Reyes; Fleet y Report.
- `feature/user-management`: Daniel Palomino; IAM.
- `feature/vehicle-information`: Sebastian Becerra.
- `feature/vehicle-monitoring`: Rodrigo Gómez.
- `feature/subscription-management`: Harrison Payesa.

Todas parten de la misma base sin módulos. Cada integrante incorpora su contexto, rutas, pruebas y revisiones con su identidad real. Coordinar cambios de `shared`, `locales` y `router.js`.

No publicar automáticamente esta base sobre la aplicación completa de Netlify antes de integrar y verificar los módulos.
