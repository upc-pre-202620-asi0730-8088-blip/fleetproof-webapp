import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { ReportingApi } from '../infrastructure/reporting-api.js';
import { ReportAssembler } from '../infrastructure/report.assembler.js';
import { Report } from '../domain/model/report.entity.js';
import { demoFindings } from '../domain/model/demo-sources.js';
const api = new ReportingApi();
export const useReportingStore = defineStore('reporting', () => {
  const reports = shallowRef([]);
  const loading = ref(false);
  const error = ref('');
  async function fetchReports() {
    loading.value = true; error.value = '';
    try { reports.value = ReportAssembler.toEntitiesFromResponse(await api.getReports()); }
    catch { error.value = 'errors.load'; }
    finally { loading.value = false; }
  }
  async function requestReport(vehicle) {
    const report = new Report({ vehicleId: vehicle.id, plate: vehicle.plate, requestedAt: new Date().toISOString(), findings: demoFindings(vehicle.plate) });
    const saved = ReportAssembler.toEntityFromResource((await api.createReport(ReportAssembler.toResourceFromEntity(report))).data);
    reports.value = [...reports.value, saved];
    return saved;
  }
  async function saveReport(report) {
    const saved = ReportAssembler.toEntityFromResource((await api.updateReport(ReportAssembler.toResourceFromEntity(report))).data);
    reports.value = reports.value.map(item => item.id === saved.id ? saved : item);
    return saved;
  }
  return { reports, loading, error, fetchReports, requestReport, saveReport };
});
