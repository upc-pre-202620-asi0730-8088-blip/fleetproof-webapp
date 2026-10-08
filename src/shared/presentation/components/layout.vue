<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';
import AuthenticationSection from '../../../user-management/presentation/components/authentication-section.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { t } = useI18n();
const expanded = ref(false);
watch(() => route.fullPath, () => { expanded.value = false; });
const items = [
  { key: 'dashboard', icon: 'pi-chart-bar' }, { key: 'vehicles', icon: 'pi-car' },
  { key: 'reports', icon: 'pi-file' }, { key: 'fleets', icon: 'pi-truck' },
  { key: 'monitoring', icon: 'pi-eye' }, { key: 'subscriptions', icon: 'pi-credit-card' },
  { key: 'alerts', icon: 'pi-bell' }, { key: 'cases', icon: 'pi-briefcase' }
];
</script>
<template>
  <a class="skip-link" href="#main">{{ t('common.view') }}</a>
  <pv-toast />
  <header class="app-header">
    <router-link to="/app/dashboard" class="brand"><img src="/fleetproof-logo.svg" alt="" /><span>FleetProof<small>BLIP</small></span></router-link>
    <pv-button v-if="!route.meta.public" class="mobile-menu" :icon="expanded ? 'pi pi-times' : 'pi pi-bars'" :aria-label="t('common.menu')" :aria-expanded="expanded" aria-controls="app-navigation" text @click="expanded = !expanded" />
    <nav id="app-navigation" v-if="!route.meta.public" :class="{ expanded }" :aria-label="t('common.menu')">
      <router-link v-for="item in items" :key="item.key" :to="'/app/' + item.key" @click="expanded = false"><i :class="'pi ' + item.icon" aria-hidden="true"></i>{{ t('nav.' + item.key) }}</router-link>
    </nav>
    <LanguageSwitcher />
    <AuthenticationSection />
  </header>
  <div class="environment">{{ t('common.simulated') }}</div>
  <main id="main" class="workspace" tabindex="-1"><router-view /></main>
  <footer class="app-footer">BLIP · FleetProof · 1ASI0730</footer>
</template>
