import { defineStore } from 'pinia';
import { shallowRef, ref } from 'vue';
import { VehicleMonitoring, MonitoringAlert } from '../domain/model/monitoring.entity.js';
import { MonitoringAssembler as M, AlertAssembler as A } from '../infrastructure/monitoring.assembler.js';
import { MonitoringApi } from '../infrastructure/monitoring-api.js';
import { useSubscriptionStore } from '../../subscription-management/application/subscription.store.js';
import { useVehicleStore as useVehicles } from '../../vehicle-information/application/vehicle.store.js';
const api=new MonitoringApi();
const snapshot=v=>({plate:v.plate, risk:v.risk, site:v.site, owner:v.owner, type:v.type});
export const useMonitoringStore=defineStore('vehicle-monitoring',()=>{
  const monitorings=shallowRef([]), alerts=shallowRef([]), error=ref(''), busy=ref(false);
  async function fetchMonitoring(){error.value=''; try {const [m,a]=await Promise.all([api.monitorings.getAll(),api.alerts.getAll()]); monitorings.value=m.data.map(M.toEntityFromResource); alerts.value=a.data.map(A.toEntityFromResource);}catch{error.value='errors.load';}}
  function requireSubscription(){if(!useSubscriptionStore().isActive('monitoring')) throw new Error('contexts.subscriptionRequired');}
  async function register(vehicleId, intervalMinutes){
    requireSubscription();
    if(monitorings.value.some(m=>m.vehicleId===vehicleId && m.status==='active')) throw new Error('contexts.alreadyMonitored');
    const vehicle=useVehicles().vehicles.find(v=>v.id===vehicleId); if(!vehicle) throw new Error('errors.load');
    const entity=new VehicleMonitoring({vehicleId,intervalMinutes,snapshot:snapshot(vehicle),nextCheckAt:new Date(Date.now()+intervalMinutes*60000).toISOString()});
    const saved=M.toEntityFromResource((await api.monitorings.create(M.toResourceFromEntity(entity))).data);
    monitorings.value=[...monitorings.value,saved];
  }
  async function check(force=false){
    if(busy.value) return;
    busy.value=true; error.value='';
    try{
      requireSubscription(); const vehicles=useVehicles(); await vehicles.fetchVehicles(); if(vehicles.error) throw new Error(vehicles.error);
      for(const m of monitorings.value.filter(m=>m.status==='active' && (force || Date.parse(m.nextCheckAt)<=Date.now()))){
        const v=vehicles.vehicles.find(v=>v.id===m.vehicleId); if(!v) continue;
        const current=snapshot(v), previous=m.snapshot;
        const changes=Object.keys(current).filter(key=>current[key]!==previous[key]).map(field=>({field,before:previous[field],after:current[field]}));
        if(changes.length){const alert=A.toEntityFromResource((await api.alerts.create(A.toResourceFromEntity(new MonitoringAlert({monitoringId:m.id,vehicleId:m.vehicleId,changes})))).data); alerts.value=[...alerts.value,alert];}
        const updated=new VehicleMonitoring({...M.toResourceFromEntity(m),snapshot:current,lastCheckedAt:new Date().toISOString(),nextCheckAt:new Date(Date.now()+m.intervalMinutes*60000).toISOString()});
        await api.monitorings.update(m.id,M.toResourceFromEntity(updated)); monitorings.value=monitorings.value.map(item=>item.id===m.id?updated:item);
      }
    }catch(e){error.value=e.message.startsWith('contexts.')?e.message:'errors.load';}finally{busy.value=false;}
  }
  async function toggle(id) {
    const entry = monitorings.value.find(item => item.id === id);
    if (!entry) return;
    if (entry.status !== 'active') requireSubscription();
    const updated = new VehicleMonitoring({...M.toResourceFromEntity(entry), status:entry.status === 'active' ? 'inactive' : 'active'});
    await api.monitorings.update(id, M.toResourceFromEntity(updated));
    monitorings.value = monitorings.value.map(item => item.id === id ? updated : item);
  }
  return {monitorings,alerts,error,busy,fetchMonitoring,register,check,toggle};
});
