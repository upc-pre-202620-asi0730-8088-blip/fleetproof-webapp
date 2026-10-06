<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useReportingStore } from '../../application/reporting.store.js';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
const { t, locale } = useI18n(); const router = useRouter();
const store = useReportingStore(); const fleet = useVehicleStore();
const visible = ref(false); const selected = ref(null); const saving = ref(false); const error = ref('');
const vehicleOptions = computed(() => fleet.vehicles.map(vehicle => ({ id: vehicle.id, plate: vehicle.plate })));
async function request() {
  const vehicle = fleet.vehicles.find(item => item.id === selected.value);
  if (!vehicle) return;
  saving.value = true; error.value = '';
  try { const report = await store.requestReport(vehicle); router.push('/app/reports/' + report.id); }
  catch { error.value = t('common.error'); }
  finally { saving.value = false; }
}
onMounted(() => { store.fetchReports(); fleet.fetchVehicles(); });
</script>
<template>
  <div class="page-heading"><h1>{{ t('report.title') }}</h1><pv-button icon="pi pi-plus" :label="t('report.request')" @click="visible = true" /></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchReports" /></pv-message>
  <section class="data-panel"><pv-data-table :value="store.reports" :loading="store.loading" paginator :rows="10" data-key="id">
    <template #empty>{{ t('common.empty') }}</template><pv-column field="plate" :header="t('vehicle.plate')" />
    <pv-column :header="t('report.date')"><template #body="{ data }">{{ new Date(data.requestedAt).toLocaleDateString(locale) }}</template></pv-column>
    <pv-column :header="t('report.status')"><template #body="{ data }"><pv-tag :value="t('status.' + data.status)" :severity="data.status === 'reviewed' ? 'success' : 'info'" /></template></pv-column>
    <pv-column :header="t('common.actions')"><template #body="{ data }"><router-link :to="'/app/reports/' + data.id">{{ t('common.view') }}<i class="pi pi-arrow-right"></i></router-link></template></pv-column>
  </pv-data-table></section>
  <pv-dialog v-model:visible="visible" modal :header="t('report.request')" class="form-dialog"><form class="form-grid" @submit.prevent="request">
    <label for="report-vehicle">{{ t('report.vehicle') }}<pv-select input-id="report-vehicle" v-model="selected" :options="vehicleOptions" option-label="plate" option-value="id" :placeholder="t('report.vehicle')" :loading="fleet.loading" /></label>
    <pv-message v-if="fleet.error || error" severity="error">{{ error || t(fleet.error) }}</pv-message>
    <pv-button type="submit" icon="pi pi-file-plus" :label="t('report.request')" :disabled="!selected" :loading="saving" />
  </form></pv-dialog>
</template>
