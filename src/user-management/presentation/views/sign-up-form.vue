<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useIamStore from '../../application/iam.store.js';
import { SignUpCommand } from '../../domain/sign-up.command.js';
const { t } = useI18n(); const router = useRouter(); const store = useIamStore();
const form = ref({ username: '', password: '' });
async function signUp() { if (await store.signUp(new SignUpCommand({ username: form.value.username.trim(), password: form.value.password }))) router.push('/login'); }
</script>
<template><section class="auth-panel"><h1>{{ t('auth.signUp') }}</h1><form class="form-grid" @submit.prevent="signUp">
  <label for="new-username">{{ t('auth.username') }}<pv-input-text id="new-username" v-model="form.username" required minlength="3" pattern="[A-Za-z0-9._-]{3,}" autocomplete="username" /></label>
  <label for="new-password">{{ t('auth.password') }}<pv-input-text id="new-password" v-model="form.password" required minlength="8" type="password" autocomplete="new-password" /></label>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
  <pv-button :label="t('auth.signUp')" type="submit" icon="pi pi-user-plus" :loading="store.loading" />
</form><p><router-link to="/login">{{ t('auth.signIn') }}</router-link></p><p class="secondary">{{ t('auth.testOnly') }}</p></section></template>

