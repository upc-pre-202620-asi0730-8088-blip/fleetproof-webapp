import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./shared/presentation/views/base-home.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('./shared/presentation/views/page-not-found.vue') }
  ]
});
export default router;
