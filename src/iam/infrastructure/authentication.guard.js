import useIamStore from '../application/iam.store.js';
export const authenticationGuard = to => {
  const store = useIamStore();
  if (!store.isSignedIn && !['/login', '/register'].includes(to.path) && to.name !== 'not-found') return '/login';
  return true;
};

