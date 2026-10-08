import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IamApi } from '../infrastructure/iam-api.js';
import { SignInAssembler } from '../infrastructure/sign-in.assembler.js';
import { SignUpAssembler } from '../infrastructure/sign-up.assembler.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';
const api = new IamApi();
function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem('fleetproof-session'));
    if (session && typeof session.username === 'string' && session.username &&
      (typeof session.id === 'string' || typeof session.id === 'number') &&
      typeof session.token === 'string' && session.token &&
      session.token === localStorage.getItem('fleetproof-token')) return session;
  } catch { /* Ignore malformed saved sessions. */ }
  localStorage.removeItem('fleetproof-session');
  localStorage.removeItem('fleetproof-token');
  return null;
}
const useIamStore = defineStore('iam', () => {
  const session = readSession();
  const isSignedIn = ref(Boolean(session));
  const currentUsername = ref(session?.username ?? null);
  const currentUserId = ref(session?.id ?? 0);
  const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('fleetproof-token') : null);
  const loading = ref(false);
  const error = ref('');
  function clearSession() {
    isSignedIn.value = false; currentUsername.value = null; currentUserId.value = 0;
    localStorage.removeItem('fleetproof-token');
    localStorage.removeItem('fleetproof-session');
  }
  async function signIn(command) {
    loading.value = true; error.value = ''; clearSession();
    try {
      const resource = SignInAssembler.toResourceFromResponse(await api.signIn(SignInAssembler.toRequestFromCommand(command)));
      if (!resource) { error.value = 'auth.invalid'; return false; }
      const user = UserAssembler.toEntityFromResource(resource);
      currentUsername.value = user.username; currentUserId.value = user.id;
      localStorage.setItem('fleetproof-token', resource.token); isSignedIn.value = true;
      localStorage.setItem('fleetproof-session', JSON.stringify({id: user.id, username: user.username, token: resource.token}));
      return true;
    } catch { error.value = 'common.error'; return false; }
    finally { loading.value = false; }
  }
  async function signUp(command) {
    loading.value = true; error.value = '';
    try {
      return Boolean(SignUpAssembler.toResourceFromResponse(await api.signUp(SignUpAssembler.toRequestFromCommand(command))));
    } catch (cause) { error.value = cause.response?.status === 409 ? 'auth.duplicate' : 'common.error'; return false; }
    finally { loading.value = false; }
  }
  function signOut(router) {
    clearSession(); error.value = '';
    router.push('/login').then(() => window.location.reload());
  }
  return { isSignedIn, currentUsername, currentUserId, currentToken, loading, error, signIn, signUp, signOut };
});
export default useIamStore;
