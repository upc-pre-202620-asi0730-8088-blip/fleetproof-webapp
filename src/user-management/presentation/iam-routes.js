export default [
  { path: '/login', component: () => import('./views/sign-in-form.vue'), meta: { title: 'Login', public: true } },
  { path: '/register', component: () => import('./views/sign-up-form.vue'), meta: { title: 'Registro', public: true } }
];

