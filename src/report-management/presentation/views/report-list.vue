<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useReportingStore } from '../../application/reporting.store.js';
import DemoPaymentDialog from '../../../shared/presentation/components/demo-payment-dialog.vue';
const { t, locale } = useI18n(); const router = useRouter();
const store = useReportingStore();
const visible = ref(false), paymentVisible = ref(false), plate = ref(''), paymentPlate = ref('');
const saving = ref(false), error = ref('');
function request() {
  const normalized = plate.value.trim().toUpperCase();
  if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalized)) {error.value = t('errors.plate'); return;}
  paymentPlate.value = normalized; error.value = ''; visible.value = false; paymentVisible.value = true;
}
async function confirmPayment() {
  if (saving.value) return;
  saving.value = true; error.value = '';
  try { const report = await store.confirmIndividualPayment(paymentPlate.value); paymentVisible.value = false; plate.value = ''; await router.push('/app/reports/' + report.id); }
  catch { error.value = t('common.error'); }
  finally { saving.value = false; }
}
onMounted(store.fetchReports);
</script>
<template>
  <div class="page-heading"><h1>{{ t('report.title') }}</h1><pv-button icon="pi pi-plus" :label="t('report.request')" @click="error = ''; visible = true" /></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchReports" /></pv-message>
  <section class="data-panel"><pv-data-table :value="store.reports" :loading="store.loading" paginator :rows="10" data-key="id">
    <template #empty>{{ t('common.empty') }}</template><pv-column field="plate" :header="t('vehicle.plate')" />
    <pv-column :header="t('report.date')"><template #body="{ data }">{{ new Date(data.requestedAt).toLocaleDateString(locale) }}</template></pv-column>
    <pv-column :header="t('report.status')"><template #body="{ data }"><pv-tag :value="t('status.' + data.status)" :severity="data.status === 'reviewed' ? 'success' : 'info'" /></template></pv-column>
    <pv-column :header="t('common.actions')"><template #body="{ data }"><router-link :to="'/app/reports/' + data.id">{{ t('common.view') }}<i class="pi pi-arrow-right"></i></router-link></template></pv-column>
  </pv-data-table></section>
  <pv-dialog v-model:visible="visible" modal :header="t('report.request')" class="form-dialog"><form class="form-grid" @submit.prevent="request">
    <label for="report-plate">{{ t('vehicle.plate') }}<pv-input-text id="report-plate" v-model="plate" placeholder="ABC-123" maxlength="7" required /></label>
    <pv-message v-if="error" severity="error">{{ error }}</pv-message>
    <pv-button type="submit" icon="pi pi-qrcode" :label="t('paymentUi.continue')" :disabled="!plate.trim()" />
  </form></pv-dialog>
  <DemoPaymentDialog v-model:visible="paymentVisible" :title="t('paymentUi.individual')" :description="t('paymentUi.platePayment', {plate:paymentPlate})" :busy="saving" :error="error" @confirm="confirmPayment" />
</template>
