<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useReportingStore } from '../../application/reporting.store.js';
import { useResolutionStore } from '../../../fleet-management/application/resolution.store.js';
import { Report } from '../../domain/model/report.entity.js';
import { ReportAssembler } from '../../infrastructure/report.assembler.js';
import { ResolutionCase } from '../../../fleet-management/domain/model/case.entity.js';
const route = useRoute(); const router = useRouter(); const { t } = useI18n(); const toast = useToast();
const store = useReportingStore(); const resolution = useResolutionStore();
const report = computed(() => store.reports.find(item => String(item.id) === route.params.id));
const visible = ref(false); const saving = ref(false); const error = ref('');
const initial = () => ({ source: '', sourceUrl: '', dateChecked: new Date().toISOString().slice(0, 10), result: '', evidence: '', summary: '' });
const form = ref(initial());
function validUrl(value) { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } }
function notify() { toast.add({ severity: 'success', summary: t('common.saved'), life: 3000 }); }
async function saveEvidence() {
  error.value = '';
  if (!validUrl(form.value.sourceUrl) || !validUrl(form.value.evidence)) { error.value = t('report.invalidUrl'); return; }
  saving.value = true;
  try { await store.saveReport(new Report({ ...ReportAssembler.toResourceFromEntity(report.value), status: 'draft', findings: [...report.value.findings, { ...form.value }] })); visible.value = false; form.value = initial(); notify(); }
  catch { error.value = t('common.error'); }
  finally { saving.value = false; }
}
async function review() {
  if (!report.value.findings.length) { toast.add({ severity: 'warn', summary: t('report.reviewError'), life: 4000 }); return; }
  saving.value = true;
  try { await store.saveReport(new Report({ ...ReportAssembler.toResourceFromEntity(report.value), status: 'reviewed' })); notify(); }
  catch { toast.add({ severity: 'error', summary: t('common.error'), life: 4000 }); }
  finally { saving.value = false; }
}
async function createCase(finding) {
  saving.value = true;
  try {
    await resolution.saveCase(new ResolutionCase({ reportId: report.value.id, plate: report.value.plate, title: finding.summary || finding.result }));
    router.push('/app/cases');
  } catch { toast.add({ severity: 'error', summary: t('common.error'), life: 4000 }); }
  finally { saving.value = false; }
}
onMounted(store.fetchReports);
</script>
<template>
  <router-link to="/app/reports" class="back-link"><i class="pi pi-arrow-left"></i>{{ t('common.back') }}</router-link>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchReports" /></pv-message>
  <p v-else-if="store.loading" role="status">{{ t('common.loading') }}</p>
  <template v-else-if="report">
    <div class="page-heading"><div><h1>{{ report.plate }} · {{ t('report.detail') }}</h1><pv-tag :value="t('status.' + report.status)" :severity="report.status === 'reviewed' ? 'success' : 'info'" /></div><pv-button :label="t('report.review')" icon="pi pi-check-circle" :loading="saving" :disabled="report.status === 'reviewed'" @click="review" /></div>
    <section class="data-panel"><div class="panel-heading"><h2>{{ t('report.checklist') }}</h2><pv-button :label="t('report.add')" icon="pi pi-plus" :disabled="saving" @click="error = ''; visible = true" /></div>
      <p v-if="!report.findings.length" class="empty-state">{{ t('report.none') }}</p>
      <article v-for="(finding, index) in report.findings" :key="index" class="finding">
        <div class="finding-heading"><h3>{{ finding.source }}</h3><time>{{ finding.dateChecked }}</time></div>
        <p>{{ finding.result }}</p><p class="secondary">{{ finding.summary }}</p>
        <div class="finding-links"><a :href="finding.sourceUrl" target="_blank" rel="noopener noreferrer">{{ t('report.source') }} <i class="pi pi-external-link"></i></a><a :href="finding.evidence" target="_blank" rel="noopener noreferrer">{{ t('report.evidence') }} <i class="pi pi-external-link"></i></a><pv-button :label="t('report.createCase')" icon="pi pi-briefcase" text :disabled="saving" @click="createCase(finding)" /></div>
      </article>
    </section>
  </template>
  <p v-else>{{ t('common.empty') }}</p>
  <pv-dialog v-model:visible="visible" modal :header="t('report.add')" class="form-dialog" :closable="!saving">
    <form class="form-grid" @submit.prevent="saveEvidence">
      <label for="source">{{ t('report.source') }}<pv-input-text id="source" v-model="form.source" required /></label>
      <label for="source-url">{{ t('report.sourceUrl') }}<pv-input-text id="source-url" v-model="form.sourceUrl" type="url" required /></label>
      <label for="checked">{{ t('report.dateChecked') }}<input id="checked" class="date-input" type="date" v-model="form.dateChecked" :max="new Date().toISOString().slice(0,10)" required /></label>
      <label for="result">{{ t('report.result') }}<pv-input-text id="result" v-model="form.result" required /></label>
      <label for="evidence">{{ t('report.evidence') }}<pv-input-text id="evidence" type="url" v-model="form.evidence" required /></label>
      <label for="summary">{{ t('report.summary') }}<pv-textarea id="summary" v-model="form.summary" rows="3" required /></label>
      <pv-message v-if="error" severity="error">{{ error }}</pv-message>
      <div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="saving" @click="visible = false" /><pv-button :label="t('common.save')" type="submit" :loading="saving" /></div>
    </form>
  </pv-dialog>
</template>
