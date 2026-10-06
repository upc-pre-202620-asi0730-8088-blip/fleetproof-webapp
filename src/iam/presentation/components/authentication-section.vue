<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useIamStore from '../../application/iam.store.js';
const { t } = useI18n(); const router = useRouter(); const store = useIamStore();
</script>
<template><div v-if="store.isSignedIn" class="session"><span>{{ store.currentUsername }}</span><pv-button icon="pi pi-sign-out" text :title="t('auth.signOut')" :aria-label="t('auth.signOut')" @click="store.signOut(router)" /></div></template>

