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
import { findingsForReport, reportSources } from '../../domain/model/demo-sources.js';
import { downloadReportPdf } from '../../infrastructure/report-pdf.js';
const route = useRoute(); const router = useRouter(); const { t } = useI18n(); const toast = useToast();
const store = useReportingStore(); const resolution = useResolutionStore();
const report = computed(() => store.reports.find(item => String(item.id) === route.params.id));
const findings = computed(() => report.value ? findingsForReport(report.value) : []);
const downloadable = computed(() => report.value?.status === 'published');
const comparisonVisible = ref(false);
const previous = computed(() => store.reports.filter(item => item.plate === report.value?.plate && item.id !== report.value?.id && item.requestedAt < report.value?.requestedAt).sort((a,b) => b.requestedAt.localeCompare(a.requestedAt))[0]);
const differences = computed(() => previous.value ? findings.value.map((item, index) => ({source: item.source, before: findingsForReport(previous.value)[index].result, after: item.result})) : []);
const visible = ref(false); const saving = ref(false); const error = ref('');
const initial = () => ({ source: '', sourceUrl: '', dateChecked: new Date().toISOString().slice(0, 10), result: '', evidence: '', summary: '' });
const form = ref(initial());
function validUrl(value) { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } }
function notify() { toast.add({ severity: 'success', summary: t('common.saved'), life: 3000 }); }
async function saveEvidence() {
  error.value = '';
  if (!validUrl(form.value.sourceUrl) || !validUrl(form.value.evidence)) { error.value = t('report.invalidUrl'); return; }
  saving.value = true;
  try { await store.saveReport(new Report({ ...ReportAssembler.toResourceFromEntity(report.value), status: 'draft', findings: findings.value.map(item => item.source === form.value.source ? {...form.value} : item) })); visible.value = false; form.value = initial(); notify(); }
  catch { error.value = t('common.error'); }
  finally { saving.value = false; }
}
async function review() {
  if (!findings.value.length) { toast.add({ severity: 'warn', summary: t('report.reviewError'), life: 4000 }); return; }
  saving.value = true;
  try { await store.saveReport(new Report({ ...ReportAssembler.toResourceFromEntity(report.value), status: 'reviewed', findings: findings.value })); notify(); }
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
async function download() {
  saving.value = true;
  try { await downloadReportPdf(report.value); }
  catch { toast.add({severity: 'error', summary: t('common.error'), life: 4000}); }
  finally { saving.value = false; }
}
async function setStatus(status) {
  saving.value = true;
  try { await store.saveReport(new Report({...ReportAssembler.toResourceFromEntity(report.value), status, findings: findings.value})); notify(); }
  catch { toast.add({severity:'error', summary:t('common.error'), life:4000}); }
  finally { saving.value = false; }
}
</script>
<template>
  <router-link to="/app/reports" class="back-link"><i class="pi pi-arrow-left"></i>{{ t('common.back') }}</router-link>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchReports" /></pv-message>
  <p v-else-if="store.loading" role="status">{{ t('common.loading') }}</p>
  <template v-else-if="report">
    <div class="page-heading"><div><h1>{{ report.plate }} · {{ t('report.detail') }}</h1><p>{{ t('workspaceUi.demo') }}</p></div><div class="heading-actions"><pv-button :label="t('workspaceUi.compare')" icon="pi pi-clone" outlined @click="comparisonVisible = true" /><pv-button :label="t('workspaceUi.download')" icon="pi pi-download" :loading="saving" :disabled="!downloadable" @click="download" /></div></div>
    <div class="report-grid"><section>
    <section class="data-panel"><div class="panel-heading"><h2>{{ t('report.checklist') }}</h2><pv-button :label="t('report.add')" icon="pi pi-plus" :disabled="saving" @click="error = ''; visible = true" /></div>
      <p v-if="!report.findings.length" class="empty-state">{{ t('report.none') }}</p>
      <article v-for="(finding, index) in findings" :key="index" class="finding">
        <div class="finding-heading"><h3>{{ finding.source }}</h3><time>{{ finding.dateChecked }}</time></div>
        <p>{{ finding.result }}</p><p class="secondary">{{ finding.summary }}</p>
        <div class="finding-links"><span v-if="finding.simulated" class="secondary">{{ finding.evidence }}</span><template v-else><a :href="finding.sourceUrl" target="_blank" rel="noopener noreferrer">{{ t('report.source') }} <i class="pi pi-external-link"></i></a><a :href="finding.evidence" target="_blank" rel="noopener noreferrer">{{ t('report.evidence') }} <i class="pi pi-external-link"></i></a></template><pv-button :label="t('report.createCase')" icon="pi pi-briefcase" text :disabled="saving" @click="createCase(finding)" /></div>
      </article>
    </section>
    </section><aside class="report-sidebar"><h2>{{ t('report.review') }}</h2><pv-tag :value="report.status === 'published' ? t('workspaceUi.published') : t('status.' + report.status)" /><p>{{ report.requestedAt.slice(0,10) }}</p><pv-button :label="t('report.review')" icon="pi pi-check-circle" :loading="saving" :disabled="report.status !== 'draft'" @click="review" /><pv-button :label="t('workspaceUi.publish')" icon="pi pi-send" :disabled="report.status !== 'reviewed' || saving" @click="setStatus('published')" /><pv-button :label="t('workspaceUi.reject')" icon="pi pi-undo" outlined :disabled="saving || report.status === 'draft'" @click="setStatus('draft')" /></aside></div>
  </template>
  <p v-else>{{ t('common.empty') }}</p>
  <pv-dialog v-model:visible="comparisonVisible" modal :header="t('workspaceUi.compare')" class="form-dialog"><p v-if="!previous">{{ t('workspaceUi.noVersion') }}</p><article v-for="item in differences" :key="item.source" class="finding"><h3>{{ item.source }}</h3><p>{{ item.before }} <i class="pi pi-arrow-right"></i> {{ item.after }}</p><pv-tag v-if="item.before === item.after" :value="t('comparisonUi.unchanged')" severity="info" /></article></pv-dialog>
  <pv-dialog v-model:visible="visible" modal :header="t('report.add')" class="form-dialog" :closable="!saving">
    <form class="form-grid" @submit.prevent="saveEvidence">
      <label for="source">{{ t('report.source') }}<pv-select input-id="source" v-model="form.source" :options="reportSources" required /></label>
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
