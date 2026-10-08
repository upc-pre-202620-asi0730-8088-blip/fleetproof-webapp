<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSubscriptionStore } from '../../application/subscription.store.js';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
import { useReportingStore } from '../../../report-management/application/reporting.store.js';
import { useMonitoringStore } from '../../../vehicle-monitoring/application/monitoring.store.js';
const store = useSubscriptionStore(), {t} = useI18n();
const vehicles = useVehicleStore(), reports = useReportingStore(), monitoring = useMonitoringStore();
async function run(action) { try { await action(); } catch { store.error = 'errors.load'; } }
onMounted(() => {store.fetchSubscriptions(); vehicles.fetchVehicles(); reports.fetchReports(); monitoring.fetchMonitoring();});
</script>
<template>
<div class="page-heading"><h1>{{ t('contexts.subscriptions') }}</h1></div>
<p>{{ t('contexts.paymentNotice') }}</p>
<p>{{ t('planUi.demo') }}</p>
<div class="metrics"><article class="metric"><span>{{ t('workspaceUi.vehicles') }}</span><strong>{{ vehicles.vehicles.length }} / 50</strong></article><article class="metric"><span>{{ t('nav.reports') }}</span><strong>{{ reports.reports.length }} / 100</strong></article><article class="metric"><span>{{ t('nav.monitoring') }}</span><strong>{{ monitoring.monitorings.filter(item => item.status === 'active').length }} / 25</strong></article></div>
<pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
<div class="filters"><pv-button v-for="service in ['monitoring','fleet']" :key="service" icon="pi pi-plus" :label="t('contexts.' + service)" @click="run(() => store.request(service))" /></div>
<pv-data-table :value="store.subscriptions" data-key="id">
<template #empty>{{ t('common.empty') }}</template>
<pv-column :header="t('contexts.service')"><template #body="{data}">{{ t('contexts.' + data.service) }}</template></pv-column>
<pv-column :header="t('contexts.status')"><template #body="{data}">{{ t('contexts.' + data.status) }}</template></pv-column>
<pv-column :header="t('contexts.payment')"><template #body="{data}">{{ t('contexts.' + data.paymentStatus) }}</template></pv-column>
<pv-column :header="t('contexts.actions')"><template #body="{data}"><pv-button icon="pi pi-check" :label="t('contexts.paySuccess')" :disabled="data.status === 'active'" @click="run(() => store.simulatePayment(data.id, true))" /><pv-button icon="pi pi-times" text :label="t('contexts.payFailure')" :disabled="data.status === 'active'" @click="run(() => store.simulatePayment(data.id, false))" /></template></pv-column>
</pv-data-table>
</template>
