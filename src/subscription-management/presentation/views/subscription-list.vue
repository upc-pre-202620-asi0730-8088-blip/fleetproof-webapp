<script setup>
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSubscriptionStore } from '../../application/subscription.store.js';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
import { useReportingStore } from '../../../report-management/application/reporting.store.js';
import { useMonitoringStore } from '../../../vehicle-monitoring/application/monitoring.store.js';
import DemoPaymentDialog from '../../../shared/presentation/components/demo-payment-dialog.vue';
const store = useSubscriptionStore(), {t} = useI18n();
const vehicles = useVehicleStore(), reports = useReportingStore(), monitoring = useMonitoringStore();
const selectedPlan = ref('monthly'), paymentPlan = ref('monthly'), paymentVisible = ref(false), busy = ref(false), error = ref(''), success = ref(false);
const plans = computed(() => ['weekly','monthly'].map(value => ({value,label:t('paymentUi.' + value)})));
const rows = computed(() => store.subscriptions.filter(item => item.service === 'fleet'));
function openPayment() {paymentPlan.value = selectedPlan.value; error.value = ''; success.value = false; paymentVisible.value = true;}
async function confirmPayment() {
  if (busy.value) return;
  busy.value = true; error.value = '';
  try {await store.confirmPlanPayment(paymentPlan.value); paymentVisible.value = false; success.value = true;}
  catch {error.value = t('common.error');}
  finally {busy.value = false;}
}
onMounted(() => {store.fetchSubscriptions(); vehicles.fetchVehicles(); reports.fetchReports(); monitoring.fetchMonitoring();});
</script>
<template>
  <div class="page-heading"><h1>{{ t('contexts.subscriptions') }}</h1></div>
  <p>{{ t('contexts.paymentNotice') }}</p>
  <p>{{ t('planUi.demo') }}</p>
  <div class="metrics"><article class="metric"><span>{{ t('workspaceUi.vehicles') }}</span><strong>{{ vehicles.vehicles.length }} / 50</strong></article><article class="metric"><span>{{ t('nav.reports') }}</span><strong>{{ reports.reports.length }} / 100</strong></article><article class="metric"><span>{{ t('nav.monitoring') }}</span><strong>{{ monitoring.monitorings.filter(item => item.status === 'active').length }} / 25</strong></article></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
  <pv-message v-if="success" severity="success">{{ t('paymentUi.activated') }}</pv-message>
  <form class="filters" @submit.prevent="openPayment"><label for="subscription-plan">{{ t('paymentUi.plan') }}<pv-select input-id="subscription-plan" v-model="selectedPlan" :options="plans" option-label="label" option-value="value" /></label><pv-button icon="pi pi-qrcode" :label="t('paymentUi.continue')" type="submit" :disabled="busy" /></form>
  <pv-data-table :value="rows" data-key="id">
    <template #empty>{{ t('common.empty') }}</template>
    <pv-column :header="t('contexts.service')"><template #body="{data}">{{ t('contexts.' + data.service) }}</template></pv-column>
    <pv-column :header="t('paymentUi.plan')"><template #body="{data}">{{ t('paymentUi.' + data.plan) }}</template></pv-column>
    <pv-column :header="t('contexts.status')"><template #body="{data}">{{ t('contexts.' + data.status) }}</template></pv-column>
    <pv-column :header="t('contexts.payment')"><template #body="{data}">{{ t('contexts.' + data.paymentStatus) }}</template></pv-column>
  </pv-data-table>
  <DemoPaymentDialog v-model:visible="paymentVisible" :title="t('paymentUi.subscription')" :description="t('paymentUi.planPayment', {plan:t('paymentUi.' + paymentPlan)})" :busy="busy" :error="error" @confirm="confirmPayment" />
</template>
