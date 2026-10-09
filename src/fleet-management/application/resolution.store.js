import { defineStore } from 'pinia';
import { ref, shallowRef, computed } from 'vue';
import { ResolutionApi } from '../infrastructure/resolution-api.js';
import { CaseAssembler } from '../infrastructure/case.assembler.js';
const api = new ResolutionApi();
export const useResolutionStore = defineStore('resolution', () => {
  const cases = shallowRef([]);
  const loading = ref(false);
  const error = ref('');
  const openCount = computed(() => cases.value.filter(item => item.status !== 'resolved').length);
  async function fetchCases() {
    loading.value = true; error.value = '';
    try { cases.value = CaseAssembler.toEntitiesFromResponse(await api.getCases()); }
    catch { error.value = 'errors.load'; }
    finally { loading.value = false; }
  }
  async function saveCase(item) {
    if (item.status === 'resolved' && (!item.evidence.trim() || !item.note.trim())) throw new Error('errors.evidence');
    const resource = CaseAssembler.toResourceFromEntity(item);
    const response = item.id === undefined ? await api.createCase(resource) : await api.updateCase(resource);
    const saved = CaseAssembler.toEntityFromResource(response.data);
    cases.value = item.id === undefined ? [...cases.value, saved] : cases.value.map(entry => entry.id === saved.id ? saved : entry);
    return saved;
  }
  return { cases, loading, error, openCount, fetchCases, saveCase };
});

