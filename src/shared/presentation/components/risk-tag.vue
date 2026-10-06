<script setup>
import { useI18n } from 'vue-i18n';
defineProps({ risk: { type: String, required: true } });
const { t } = useI18n();
</script>
<template><pv-tag :value="t('risk.' + risk)" :severity="risk === 'high' ? 'danger' : risk === 'medium' ? 'warn' : 'success'" /></template>

