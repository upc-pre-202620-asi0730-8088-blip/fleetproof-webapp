import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IamApi } from '../infrastructure/iam-api.js';
import { SignInAssembler } from '../infrastructure/sign-in.assembler.js';
import { SignUpAssembler } from '../infrastructure/sign-up.assembler.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';
const api = new IamApi();
const useIamStore = defineStore('iam', () => {
  const isSignedIn = ref(false);
  const currentUsername = ref(null);
  const currentUserId = ref(0);
  const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('fleetproof-token') : null);
  const loading = ref(false);
  const error = ref('');
  function clearSession() {
    isSignedIn.value = false; currentUsername.value = null; currentUserId.value = 0;
    localStorage.removeItem('fleetproof-token');
  }
  async function signIn(command) {
    loading.value = true; error.value = ''; clearSession();
    try {
      const resource = SignInAssembler.toResourceFromResponse(await api.signIn(SignInAssembler.toRequestFromCommand(command)));
      if (!resource) { error.value = 'auth.invalid'; return false; }
      const user = UserAssembler.toEntityFromResource(resource);
      currentUsername.value = user.username; currentUserId.value = user.id;
      localStorage.setItem('fleetproof-token', resource.token); isSignedIn.value = true;
      return true;
    } catch { error.value = 'common.error'; return false; }
    finally { loading.value = false; }
  }
  async function signUp(command) {
    loading.value = true; error.value = '';
    try {
      const users = (await api.getUsers()).data;
      if (users.some(user => user.username === command.username)) { error.value = 'auth.duplicate'; return false; }
      return Boolean(SignUpAssembler.toResourceFromResponse(await api.signUp(SignUpAssembler.toRequestFromCommand(command))));
    } catch { error.value = 'common.error'; return false; }
    finally { loading.value = false; }
  }
  function signOut(router) { clearSession(); error.value = ''; router.push('/login'); }
  return { isSignedIn, currentUsername, currentUserId, currentToken, loading, error, signIn, signUp, signOut };
});
export default useIamStore;

