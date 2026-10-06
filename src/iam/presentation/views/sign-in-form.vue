<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useIamStore from '../../application/iam.store.js';
import { SignInCommand } from '../../domain/sign-in.command.js';
const { t } = useI18n(); const router = useRouter(); const store = useIamStore();
const form = ref({ username: '', password: '' });
async function signIn() { if (await store.signIn(new SignInCommand(form.value))) router.push('/app/dashboard'); }
</script>
<template><section class="auth-panel"><h1>{{ t('auth.signIn') }}</h1><form class="form-grid" @submit.prevent="signIn">
  <label for="username">{{ t('auth.username') }}<pv-input-text id="username" v-model="form.username" required autocomplete="username" /></label>
  <label for="password">{{ t('auth.password') }}<pv-input-text id="password" v-model="form.password" required type="password" autocomplete="current-password" /></label>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
  <pv-button :label="t('auth.signIn')" icon="pi pi-sign-in" type="submit" :loading="store.loading" />
</form><p><router-link to="/register">{{ t('auth.signUp') }}</router-link></p><p class="secondary">{{ t('auth.testOnly') }}</p></section></template>

