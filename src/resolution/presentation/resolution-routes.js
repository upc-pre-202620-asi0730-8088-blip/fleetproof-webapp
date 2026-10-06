export default [
  { path: '/app/alerts', component: () => import('./views/case-list.vue'), meta: { title: 'Alertas' } },
  { path: '/app/cases', component: () => import('./views/case-list.vue'), meta: { title: 'Casos' } }
];

