<script setup>import { useI18n } from 'vue-i18n'; const { t } = useI18n();</script>
<template><h1>{{ t('notFound.title') }}</h1><router-link to="/app/dashboard">{{ t('notFound.back') }}</router-link></template>

