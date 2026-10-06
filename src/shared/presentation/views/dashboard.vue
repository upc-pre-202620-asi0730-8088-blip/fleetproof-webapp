<script setup>
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
import { useResolutionStore } from '../../../fleet-management/application/resolution.store.js';
import RiskTag from '../components/risk-tag.vue';
import { useMonitoringStore } from '../../../vehicle-monitoring/application/monitoring.store.js';
const { t } = useI18n();
const fleet = useVehicleStore();
const resolution = useResolutionStore();
const monitoring = useMonitoringStore();
const stats = computed(() => [
  { label: 'total', value: fleet.vehicles.length, icon: 'pi-car' },
  { label: 'critical', value: fleet.criticalCount, icon: 'pi-exclamation-triangle' },
  { label: 'monitored', value: monitoring.monitorings.filter(m => m.status === 'active').length, icon: 'pi-eye' },
  { label: 'open', value: resolution.openCount, icon: 'pi-briefcase' }
]);
onMounted(() => { fleet.fetchVehicles(); resolution.fetchCases(); monitoring.fetchMonitoring(); });
</script>
<template>
  <div class="page-heading"><div><h1>{{ t('dashboard.title') }}</h1><p>{{ t('dashboard.subtitle') }}</p></div><router-link class="p-button" to="/app/vehicles"><i class="pi pi-car"></i>{{ t('dashboard.goFleet') }}</router-link></div>
  <pv-message v-if="fleet.error || resolution.error" severity="error">{{ t(fleet.error || resolution.error) }} <pv-button :label="t('common.retry')" text @click="fleet.fetchVehicles(); resolution.fetchCases()" /></pv-message>
  <div class="metrics"><article v-for="stat in stats" :key="stat.label" class="metric"><span>{{ t('dashboard.' + stat.label) }}</span><strong>{{ stat.value }}</strong><i :class="'pi ' + stat.icon" aria-hidden="true"></i></article></div>
  <div class="dashboard-grid">
    <section class="data-panel"><div class="panel-heading"><h2>{{ t('dashboard.fleet') }}</h2></div>
      <pv-data-table :value="fleet.vehicles.slice(0, 6)" :loading="fleet.loading" data-key="id">
        <template #empty>{{ t('common.empty') }}</template>
        <pv-column field="plate" :header="t('vehicle.plate')" /><pv-column field="type" :header="t('vehicle.type')" />
        <pv-column :header="t('vehicle.risk')"><template #body="{ data }"><RiskTag :risk="data.risk" /></template></pv-column>
        <pv-column field="site" :header="t('vehicle.site')" />
      </pv-data-table>
    </section>
    <aside>
      <section class="data-panel"><div class="panel-heading"><h2>{{ t('dashboard.distribution') }}</h2></div><div class="risk-bars"><div v-for="risk in ['high', 'medium', 'low']" :key="risk"><RiskTag :risk="risk" /><meter :value="fleet.vehicles.filter(v => v.risk === risk).length" :max="Math.max(fleet.vehicles.length, 1)"></meter><span>{{ fleet.vehicles.filter(v => v.risk === risk).length }}</span></div></div></section>
      <section class="data-panel"><div class="panel-heading"><h2>{{ t('dashboard.recent') }}</h2></div><ul class="case-summary"><li v-for="item in resolution.cases.filter(c => c.status !== 'resolved').slice(0, 4)" :key="item.id"><RiskTag :risk="item.severity" /><router-link to="/app/cases"><strong>{{ item.plate }}</strong><span>{{ item.title }}</span></router-link></li><li v-if="!resolution.openCount">{{ t('common.empty') }}</li></ul></section>
    </aside>
  </div>
</template>
