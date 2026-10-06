import { createRouter, createWebHistory } from 'vue-router';
import fleetRoutes from './fleet/presentation/fleet-routes.js';
import reportingRoutes from './reporting/presentation/reporting-routes.js';
import resolutionRoutes from './resolution/presentation/resolution-routes.js';
import iamRoutes from './iam/presentation/iam-routes.js';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/app/dashboard' },
    { path: '/app/dashboard', component: () => import('./shared/presentation/views/dashboard.vue'), meta: { title: 'Dashboard' } },
    ...fleetRoutes, ...reportingRoutes, ...resolutionRoutes, ...iamRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./shared/presentation/views/page-not-found.vue'), meta: { title: '404', public: true } }
  ]
});
router.beforeEach(authenticationGuard);
router.afterEach(to => { document.title = 'FleetProof | ' + to.meta.title; });
export default router;
