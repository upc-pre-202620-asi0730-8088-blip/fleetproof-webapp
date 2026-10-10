export default [
  { path: '/app/reports', component: () => import('./views/report-list.vue'), meta: { title: 'Reportes' } },
  { path: '/app/reports/:id', component: () => import('./views/report-detail.vue'), meta: { title: 'Reporte' } }
];

