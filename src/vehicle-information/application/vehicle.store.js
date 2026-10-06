import { defineStore } from 'pinia';
import { ref, shallowRef, computed } from 'vue';
import { VehicleApi } from '../infrastructure/vehicle-api.js';
import { VehicleAssembler } from '../infrastructure/vehicle.assembler.js';
const api = new VehicleApi();
export const useVehicleStore = defineStore('vehicle-information', () => {
  const vehicles = shallowRef([]);
  const loading = ref(false);
  const error = ref('');
  const criticalCount = computed(() => vehicles.value.filter(vehicle => vehicle.risk === 'high').length);
  async function fetchVehicles() {
    loading.value = true;
    error.value = '';
    try { vehicles.value = VehicleAssembler.toEntitiesFromResponse(await api.getVehicles()); }
    catch { error.value = 'errors.load'; }
    finally { loading.value = false; }
  }
  async function saveVehicle(vehicle) {
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(vehicle.plate)) throw new Error('errors.plate');
    if (vehicles.value.some(item => item.plate === vehicle.plate && item.id !== vehicle.id)) throw new Error('errors.duplicate');
    const resource = VehicleAssembler.toResourceFromEntity(vehicle);
    const response = vehicle.id === undefined ? await api.createVehicle(resource) : await api.updateVehicle(resource);
    const saved = VehicleAssembler.toEntityFromResource(response.data);
    vehicles.value = vehicle.id === undefined ? [...vehicles.value, saved] : vehicles.value.map(item => item.id === saved.id ? saved : item);
    return saved;
  }
  return { vehicles, loading, error, criticalCount, fetchVehicles, saveVehicle };
});

