import { createRouter, createWebHistory } from 'vue-router';
import fleetRoutes from './vehicle-information/presentation/fleet-routes.js';
import reportingRoutes from './report-management/presentation/reporting-routes.js';
import resolutionRoutes from './fleet-management/presentation/resolution-routes.js';
import iamRoutes from './user-management/presentation/iam-routes.js';
import { authenticationGuard } from './user-management/infrastructure/authentication.guard.js';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/app/dashboard' },
    { path: '/app/dashboard', component: () => import('./shared/presentation/views/dashboard.vue'), meta: { title: 'Dashboard' } },
    ...fleetRoutes, ...reportingRoutes, ...resolutionRoutes, ...iamRoutes,
    { path: '/app/fleets', component: () => import('./fleet-management/presentation/views/fleet-list.vue'), meta: { title: 'Flotas' } },
    { path: '/app/subscriptions', component: () => import('./subscription-management/presentation/views/subscription-list.vue'), meta: { title: 'Suscripciones' } },
    { path: '/app/monitoring', component: () => import('./vehicle-monitoring/presentation/views/monitoring-list.vue'), meta: { title: 'Monitoreo' } },
    { path: '/app/alerts', component: () => import('./vehicle-monitoring/presentation/views/monitoring-list.vue'), meta: { title: 'Alertas' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./shared/presentation/views/page-not-found.vue'), meta: { title: '404', public: true } }
  ]
});
router.beforeEach(authenticationGuard);
router.afterEach(to => { document.title = 'FleetProof | ' + to.meta.title; });
export default router;
