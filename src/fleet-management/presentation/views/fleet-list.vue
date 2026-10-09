<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFleetManagementStore } from '../../application/fleet.store.js';
import { useVehicleStore as useVehicles } from '../../../vehicle-information/application/vehicle.store.js';
import { useSubscriptionStore } from '../../../subscription-management/application/subscription.store.js';
import RiskTag from '../../../shared/presentation/components/risk-tag.vue';
const store = useFleetManagementStore(), vehicles = useVehicles(), subscriptions = useSubscriptionStore(), {t} = useI18n();
const name = ref(''), fleetId = ref(), vehicleId = ref(), responsible = ref('');
const fleetOptions = computed(() => store.fleets.map(f => ({id:f.id, name:f.name})));
const vehicleOptions = computed(() => vehicles.vehicles.map(v => ({id:v.id, plate:v.plate})));
const rows = computed(() => store.assignments.map(a => ({id:a.id, fleet:store.fleets.find(f => f.id === a.fleetId)?.name, plate:vehicles.vehicles.find(v => v.id === a.vehicleId)?.plate, responsible:a.responsible, risk:vehicles.vehicles.find(v => v.id === a.vehicleId)?.risk})));
async function run(action) { try { await action(); store.error = ''; } catch(e) { store.error = e.message.startsWith('contexts.') ? e.message : 'errors.load'; } }
onMounted(() => {store.fetchFleets(); vehicles.fetchVehicles(); subscriptions.fetchSubscriptions();});
</script>
<template>
<div class="page-heading"><h1>{{ t('contexts.fleets') }}</h1></div>
<pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
<pv-message v-if="!subscriptions.isActive('fleet')" severity="warn">{{ t('contexts.subscriptionRequired') }} <router-link to="/app/subscriptions">{{ t('contexts.subscriptions') }}</router-link></pv-message>
<form class="filters" @submit.prevent="run(async () => {await store.createFleet(name); name = '';})"><label>{{ t('contexts.fleetName') }}<pv-input-text v-model="name" required /></label><pv-button type="submit" icon="pi pi-plus" :label="t('contexts.createFleet')" /></form>
<form class="filters" @submit.prevent="run(() => store.assign({fleetId, vehicleId, responsible}))">
<label>{{ t('contexts.fleets') }}<pv-select v-model="fleetId" :aria-label="t('contexts.fleets')" :options="fleetOptions" option-label="name" option-value="id" required /></label>
<label>{{ t('vehicle.plate') }}<pv-select v-model="vehicleId" :aria-label="t('vehicle.plate')" :options="vehicleOptions" option-label="plate" option-value="id" required /></label>
<label>{{ t('contexts.responsible') }}<pv-input-text v-model="responsible" required /></label>
<pv-button type="submit" icon="pi pi-link" :label="t('contexts.assign')" />
</form>
<pv-data-table :value="rows" data-key="id"><template #empty>{{ t('common.empty') }}</template><pv-column field="fleet" :header="t('contexts.fleets')" /><pv-column field="plate" :header="t('vehicle.plate')" /><pv-column field="responsible" :header="t('contexts.responsible')" /><pv-column :header="t('vehicle.risk')"><template #body="{data}"><RiskTag :risk="data.risk" /></template></pv-column></pv-data-table>
</template>
