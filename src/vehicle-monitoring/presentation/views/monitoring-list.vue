<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { useVehicleStore as useVehicles } from '../../../vehicle-information/application/vehicle.store.js';
import { useSubscriptionStore } from '../../../subscription-management/application/subscription.store.js';
const store=useMonitoringStore(), vehicles=useVehicles(), subscriptions=useSubscriptionStore(), {t}=useI18n();
const vehicleId=ref(), interval=ref(60);
const options=computed(()=>vehicles.vehicles.map(v=>({id:v.id,plate:v.plate})));
const rows=computed(()=>store.monitorings.map(m=>({id:m.id,plate:vehicles.vehicles.find(v=>v.id===m.vehicleId)?.plate,interval:m.intervalMinutes,last:m.lastCheckedAt,next:m.nextCheckAt})));
let timer;
async function register(){try{await store.register(vehicleId.value,Number(interval.value));store.error='';}catch(e){store.error=e.message.startsWith('contexts.')?e.message:'errors.load';}}
onMounted(async()=>{await Promise.all([store.fetchMonitoring(),vehicles.fetchVehicles(),subscriptions.fetchSubscriptions()]); timer=setInterval(()=>{if(subscriptions.isActive('monitoring')) store.check();},15000);});
onUnmounted(()=>clearInterval(timer));
</script>
<template>
<div class="page-heading"><h1>{{ t('contexts.monitoring') }}</h1><pv-button icon="pi pi-refresh" :label="t('contexts.checkNow')" :loading="store.busy" @click="store.check(true)" /></div>
<p>{{ t('contexts.monitoringNotice') }}</p>
<pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
<pv-message v-if="!subscriptions.isActive('monitoring')" severity="warn">{{ t('contexts.subscriptionRequired') }} <router-link to="/app/subscriptions">{{ t('contexts.subscriptions') }}</router-link></pv-message>
<form class="filters" @submit.prevent="register"><label>{{ t('vehicle.plate') }}<pv-select v-model="vehicleId" :aria-label="t('vehicle.plate')" :options="options" option-label="plate" option-value="id" required /></label><label>{{ t('contexts.interval') }}<input v-model="interval" type="number" min="1" step="1" required /></label><pv-button type="submit" icon="pi pi-eye" :label="t('contexts.activate')" /></form>
<pv-data-table :value="rows" data-key="id"><template #empty>{{ t('common.empty') }}</template><pv-column field="plate" :header="t('vehicle.plate')" /><pv-column field="interval" :header="t('contexts.interval')" /><pv-column field="last" :header="t('contexts.lastCheck')" /><pv-column field="next" :header="t('contexts.nextCheck')" /></pv-data-table>
<h2>{{ t('nav.alerts') }}</h2>
<ul class="case-summary"><li v-for="alert in store.alerts" :key="alert.id"><strong>{{ vehicles.vehicles.find(v=>v.id===alert.vehicleId)?.plate }} · {{ alert.createdAt }}</strong><span v-for="change in alert.changes" :key="change.field">{{ change.field }}: {{ change.before }} / {{ change.after }}</span></li><li v-if="!store.alerts.length">{{ t('common.empty') }}</li></ul>
</template>
