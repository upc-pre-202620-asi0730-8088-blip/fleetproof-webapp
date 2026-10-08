<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useIamStore from '../../application/iam.store.js';
const { t } = useI18n(); const router = useRouter(); const store = useIamStore();
</script>
<template><div v-if="store.isSignedIn" class="session"><router-link to="/app/profile" class="profile-link"><i class="pi pi-user" aria-hidden="true"></i>{{ store.currentUsername }}</router-link><router-link to="/app/subscriptions" class="account-tool" :title="t('nav.subscriptions')" :aria-label="t('nav.subscriptions')"><i class="pi pi-credit-card"></i></router-link><pv-button icon="pi pi-sign-out" text :title="t('auth.signOut')" :aria-label="t('auth.signOut')" @click="store.signOut(router)" /></div></template>
