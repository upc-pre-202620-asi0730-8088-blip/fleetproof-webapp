<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { BaseApi } from '../../../shared/infrastructure/base-api.js';
import useIamStore from '../../application/iam.store.js';
const {t} = useI18n(), router = useRouter(), store = useIamStore(), api = new BaseApi();
const username = ref(store.currentUsername), password = ref(''), currentPassword = ref('');
const confirmation = ref(false), busy = ref(false), message = ref(''), failure = ref(''), role = ref('');
onMounted(async () => { try { role.value = (await api.http.get('/account')).data.role; } catch { failure.value = t('common.error'); } });
async function save() {
  busy.value = true; failure.value = ''; message.value = '';
  try {
    const {data} = await api.http.patch('/account', {username: username.value, password: password.value, currentPassword: currentPassword.value});
    if (data.signInRequired) { store.signOut(router); return; }
    store.currentUsername = data.username;
    const session = JSON.parse(localStorage.getItem('fleetproof-session'));
    localStorage.setItem('fleetproof-session', JSON.stringify({...session, username: data.username}));
    currentPassword.value = ''; message.value = t('common.saved');
  } catch (error) { failure.value = t(error.response?.status === 409 ? 'auth.duplicate' : error.response?.status === 403 ? 'profile.denied' : 'common.error'); }
  finally { busy.value = false; }
}
async function remove() {
  busy.value = true; failure.value = '';
  try { await api.http.delete('/account', {data: {currentPassword: currentPassword.value}}); store.signOut(router); }
  catch { failure.value = t('profile.denied'); confirmation.value = false; }
  finally { busy.value = false; }
}
</script>
<template>
  <div class="page-heading"><div><h1>{{ t('profile.title') }}</h1><p>{{ store.currentUsername }}</p></div><router-link to="/app/subscriptions" class="p-button p-button-outlined"><i class="pi pi-credit-card"></i>{{ t('nav.subscriptions') }}</router-link></div>
  <div class="account-grid"><section><h2>{{ t('profile.details') }}</h2>
    <form class="form-grid" @submit.prevent="save">
      <label for="profile-username">{{ t('auth.username') }}<pv-input-text id="profile-username" v-model="username" required maxlength="60" :disabled="role === 'admin'" autocomplete="username" /></label>
      <label for="profile-current">{{ t('profile.current') }}<pv-input-text id="profile-current" v-model="currentPassword" type="password" required autocomplete="current-password" /></label>
      <label for="profile-password">{{ t('profile.newPassword') }}<pv-input-text id="profile-password" v-model="password" type="password" minlength="8" autocomplete="new-password" /></label>
      <pv-message v-if="failure" severity="error">{{ failure }}</pv-message><pv-message v-if="message" severity="success">{{ message }}</pv-message>
      <div class="form-actions"><pv-button icon="pi pi-save" :label="t('common.save')" type="submit" :loading="busy" /></div>
    </form>
  </section><aside><h2>{{ t('profile.security') }}</h2><p>{{ t('profile.passwordNotice') }}</p><h2>{{ t('profile.delete') }}</h2><p>{{ t('profile.deleteNotice') }}</p><p v-if="role === 'admin'">{{ t('profile.adminNotice') }}</p><pv-button icon="pi pi-trash" severity="danger" outlined :label="t('profile.delete')" :disabled="role === 'admin' || busy || !currentPassword" @click="confirmation = true" /></aside></div>
  <pv-dialog v-model:visible="confirmation" modal class="form-dialog" :header="t('profile.delete')" :closable="!busy"><p>{{ t('profile.confirm') }}</p><div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="busy" @click="confirmation = false" /><pv-button icon="pi pi-trash" severity="danger" :label="t('profile.delete')" :loading="busy" @click="remove" /></div></pv-dialog>
</template>
