<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useResolutionStore } from '../../application/resolution.store.js';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
import { ResolutionCase } from '../../domain/model/case.entity.js';
import { CaseAssembler } from '../../infrastructure/case.assembler.js';
import RiskTag from '../../../shared/presentation/components/risk-tag.vue';
const { t } = useI18n(); const toast = useToast(); const store = useResolutionStore(); const fleet = useVehicleStore();
const visible = ref(false); const form = ref(CaseAssembler.toResourceFromEntity(new ResolutionCase())); const saving = ref(false); const error = ref('');
const filter = ref(null);
const statuses = computed(() => ['open','inProgress','resolved'].map(value => ({value,label:t('status.' + value)})));
const severities = computed(() => ['high','medium','low'].map(value => ({value,label:t('risk.' + value)})));
const filtered = computed(() => store.cases.filter(item => !filter.value || item.status === filter.value));
const plateOptions = computed(() => fleet.vehicles.map(vehicle => vehicle.plate));
function open(item) { form.value = CaseAssembler.toResourceFromEntity(new ResolutionCase(item)); error.value = ''; visible.value = true; }
async function save() {
  error.value = '';
  if (!form.value.plate || !form.value.title.trim() || !form.value.responsible.trim() || !form.value.dueDate) { error.value = t('common.required'); return; }
  if (form.value.status === 'resolved') {
    try { if (!['http:','https:'].includes(new URL(form.value.evidence).protocol)) throw new Error(); }
    catch { error.value = t('report.invalidUrl'); return; }
  }
  saving.value = true;
  try { await store.saveCase(new ResolutionCase(form.value)); visible.value = false; toast.add({ severity:'success',summary:t('common.saved'),life:3000 }); }
  catch (failure) { error.value = failure.message.startsWith('errors.') ? t(failure.message) : t('common.error'); }
  finally { saving.value = false; }
}
onMounted(() => { store.fetchCases(); fleet.fetchVehicles(); });
</script>
<template>
  <div class="page-heading"><h1>{{ t('case.title') }}</h1><pv-button icon="pi pi-plus" :label="t('case.add')" @click="open()" /></div>
  <div class="filters"><pv-select v-model="filter" :options="statuses" option-label="label" option-value="value" show-clear :placeholder="t('case.status')" :aria-label="t('case.status')" /></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchCases" /></pv-message>
  <section class="data-panel"><pv-data-table :value="filtered" :loading="store.loading" paginator :rows="10" data-key="id">
    <template #empty>{{ t('common.empty') }}</template>
    <pv-column field="plate" :header="t('vehicle.plate')" /><pv-column field="title" :header="t('case.titleField')" />
    <pv-column :header="t('case.severity')"><template #body="{data}"><RiskTag :risk="data.severity" /></template></pv-column>
    <pv-column field="responsible" :header="t('case.responsible')" /><pv-column field="dueDate" :header="t('case.due')" />
    <pv-column :header="t('case.status')"><template #body="{data}">{{ t('status.' + data.status) }}</template></pv-column>
    <pv-column :header="t('common.actions')"><template #body="{data}"><pv-button icon="pi pi-pencil" text :title="t('common.edit')" :aria-label="t('common.edit') + ' ' + data.plate" @click="open(data)" /></template></pv-column>
  </pv-data-table></section>
  <pv-dialog v-model:visible="visible" modal :header="t('case.title')" class="form-dialog" :closable="!saving">
    <form class="form-grid" @submit.prevent="save">
      <label for="case-plate">{{ t('vehicle.plate') }}<pv-select input-id="case-plate" v-model="form.plate" :options="plateOptions" :loading="fleet.loading" /></label>
      <label for="case-title">{{ t('case.titleField') }}<pv-textarea id="case-title" v-model="form.title" required rows="2" /></label>
      <label for="case-severity">{{ t('case.severity') }}<pv-select input-id="case-severity" v-model="form.severity" :options="severities" option-label="label" option-value="value" /></label>
      <label for="responsible">{{ t('case.responsible') }}<pv-input-text id="responsible" v-model="form.responsible" required /></label>
      <label for="due">{{ t('case.due') }}<input id="due" class="date-input" type="date" v-model="form.dueDate" required /></label>
      <label for="case-status">{{ t('case.status') }}<pv-select input-id="case-status" v-model="form.status" :options="statuses" option-label="label" option-value="value" /></label>
      <template v-if="form.status === 'resolved'">
        <label for="case-evidence">{{ t('case.evidence') }}<pv-input-text id="case-evidence" type="url" v-model="form.evidence" required /></label>
        <label for="case-note">{{ t('case.note') }}<pv-textarea id="case-note" v-model="form.note" required rows="3" /></label>
      </template>
      <pv-message v-if="error || fleet.error" severity="error">{{ error || t(fleet.error) }}</pv-message>
      <div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="saving" @click="visible = false" /><pv-button type="submit" :label="t('common.save')" :loading="saving" /></div>
    </form>
  </pv-dialog>
</template>
