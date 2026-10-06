<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useFleetStore } from '../../application/fleet.store.js';
import { useReportingStore } from '../../../reporting/application/reporting.store.js';
import { Vehicle } from '../../domain/model/vehicle.entity.js';
import { VehicleAssembler } from '../../infrastructure/vehicle.assembler.js';
import RiskTag from '../../../shared/presentation/components/risk-tag.vue';
const { t } = useI18n();
const toast = useToast(); const router = useRouter();
const store = useFleetStore(); const reporting = useReportingStore();
const search = ref(''); const risk = ref(null); const site = ref(null);
const visible = ref(false); const form = ref(VehicleAssembler.toResourceFromEntity(new Vehicle())); const error = ref(''); const saving = ref(false);
const sites = computed(() => [...new Set(store.vehicles.map(v => v.site))]);
const risks = computed(() => ['high', 'medium', 'low'].map(value => ({ value, label: t('risk.' + value) })));
const filtered = computed(() => store.vehicles.filter(v => (!risk.value || v.risk === risk.value) && (!site.value || v.site === site.value) && [v.plate, v.owner, v.site].join(' ').toLowerCase().includes(search.value.toLowerCase())));
function open(vehicle) { form.value = VehicleAssembler.toResourceFromEntity(new Vehicle(vehicle)); error.value = ''; visible.value = true; }
async function save() {
  error.value = '';
  if (![form.value.plate, form.value.type, form.value.site, form.value.owner].every(v => v.trim())) { error.value = t('common.required'); return; }
  saving.value = true;
  try { await store.saveVehicle(new Vehicle(form.value)); visible.value = false; toast.add({ severity: 'success', summary: t('common.saved'), life: 3000 }); }
  catch (failure) { error.value = failure.message.startsWith('errors.') ? t(failure.message) : t('common.error'); }
  finally { saving.value = false; }
}
async function request(vehicle) {
  saving.value = true;
  try { const report = await reporting.requestReport(vehicle); router.push('/app/reports/' + report.id); }
  catch { toast.add({ severity: 'error', summary: t('common.error'), life: 5000 }); }
  finally { saving.value = false; }
}
onMounted(store.fetchVehicles);
</script>
<template>
  <div class="page-heading"><h1>{{ t('nav.vehicles') }}</h1><pv-button icon="pi pi-plus" :label="t('vehicle.add')" @click="open()" /></div>
  <div class="filters"><pv-input-text v-model="search" :placeholder="t('vehicle.search')" :aria-label="t('vehicle.search')" /><pv-select v-model="risk" :options="risks" option-label="label" option-value="value" show-clear :placeholder="t('vehicle.risk')" :aria-label="t('vehicle.risk')" /><pv-select v-model="site" :options="sites" show-clear :placeholder="t('vehicle.site')" :aria-label="t('vehicle.site')" /></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }} <pv-button text :label="t('common.retry')" @click="store.fetchVehicles" /></pv-message>
  <section class="data-panel">
    <pv-data-table :value="filtered" :loading="store.loading" data-key="id" paginator :rows="10">
      <template #empty>{{ t('common.empty') }}</template>
      <pv-column field="plate" :header="t('vehicle.plate')" sortable /><pv-column field="type" :header="t('vehicle.type')" /><pv-column field="site" :header="t('vehicle.site')" sortable /><pv-column field="owner" :header="t('vehicle.owner')" />
      <pv-column :header="t('vehicle.risk')"><template #body="{ data }"><RiskTag :risk="data.risk" /></template></pv-column>
      <pv-column :header="t('vehicle.monitored')"><template #body="{ data }">{{ t(data.monitored ? 'vehicle.active' : 'vehicle.inactive') }}</template></pv-column>
      <pv-column :header="t('common.actions')"><template #body="{ data }"><div class="row-actions"><pv-button icon="pi pi-pencil" text :aria-label="t('common.edit') + ' ' + data.plate" :title="t('common.edit')" @click="open(data)" /><pv-button icon="pi pi-file-plus" text :disabled="saving" :aria-label="t('vehicle.request') + ' ' + data.plate" :title="t('vehicle.request')" @click="request(data)" /></div></template></pv-column>
    </pv-data-table>
  </section>
  <pv-dialog v-model:visible="visible" modal :header="t(form.id === undefined ? 'vehicle.add' : 'vehicle.edit')" class="form-dialog" :closable="!saving">
    <form class="form-grid" @submit.prevent="save">
      <label for="plate">{{ t('vehicle.plate') }}<pv-input-text id="plate" v-model="form.plate" required maxlength="7" placeholder="ABC-123" /></label>
      <label for="type">{{ t('vehicle.type') }}<pv-input-text id="type" v-model="form.type" required /></label>
      <label for="site">{{ t('vehicle.site') }}<pv-input-text id="site" v-model="form.site" required /></label>
      <label for="owner">{{ t('vehicle.owner') }}<pv-input-text id="owner" v-model="form.owner" required /></label>
      <label for="risk">{{ t('vehicle.risk') }}<pv-select input-id="risk" v-model="form.risk" :options="risks" option-label="label" option-value="value" /></label>
      <label class="checkbox-label"><input type="checkbox" v-model="form.monitored" />{{ t('vehicle.monitored') }}</label>
      <pv-message v-if="error" severity="error">{{ error }}</pv-message>
      <div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="saving" @click="visible = false" /><pv-button type="submit" icon="pi pi-check" :label="t('common.save')" :loading="saving" /></div>
    </form>
  </pv-dialog>
</template>
