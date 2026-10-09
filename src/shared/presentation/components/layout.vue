<script setup>
import LanguageSwitcher from './language-switcher.vue';
</script>
<template>
  <pv-toast />
  <header class="app-header">
    <router-link to="/" class="brand"><img src="/fleetproof-logo.svg" alt="" /><span>FleetProof<small>BLIP</small></span></router-link>
    <LanguageSwitcher />
  </header>
  <main id="main" class="workspace"><router-view /></main>
  <footer class="app-footer">BLIP · FleetProof · 1ASI0730 · NRC 8088</footer>
</template>
