<script setup>
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();
function changeLanguage(event) { locale.value = event.target.value; document.documentElement.lang = locale.value; }
</script>
<template><select class="language-switcher" :aria-label="t('common.language')" :value="locale" @change="changeLanguage"><option value="es">ES</option><option value="en">EN</option></select></template>

