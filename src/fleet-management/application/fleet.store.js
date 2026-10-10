import { defineStore } from 'pinia';
import { shallowRef, ref } from 'vue';
import { Fleet, FleetVehicleAssignment } from '../domain/model/fleet.entity.js';
import { FleetAssembler, AssignmentAssembler } from '../infrastructure/fleet.assembler.js';
import { FleetApi } from '../infrastructure/fleet-api.js';
import { useSubscriptionStore } from '../../subscription-management/application/subscription.store.js';
const api = new FleetApi();
export const useFleetManagementStore = defineStore('fleet-management', () => {
  const fleets = shallowRef([]), assignments = shallowRef([]), error = ref('');
  async function fetchFleets() {
    error.value = '';
    try { const [f,a] = await Promise.all([api.fleets.getAll(), api.assignments.getAll()]); fleets.value = f.data.map(FleetAssembler.toEntityFromResource); assignments.value = a.data.map(AssignmentAssembler.toEntityFromResource); }
    catch { error.value = 'errors.load'; }
  }
  function requireSubscription() { if (!useSubscriptionStore().isActive('fleet')) throw new Error('contexts.subscriptionRequired'); }
  async function createFleet(name) {
    requireSubscription();
    const resource = FleetAssembler.toResourceFromEntity(new Fleet({name}));
    const saved = FleetAssembler.toEntityFromResource((await api.fleets.create(resource)).data);
    fleets.value = [...fleets.value, saved];
  }
  async function assign(resource) {
    requireSubscription();
    if (!fleets.value.some(f => f.id === resource.fleetId)) throw new Error('errors.load');
    if (assignments.value.some(a => a.vehicleId === resource.vehicleId)) throw new Error('contexts.alreadyAssigned');
    const saved = AssignmentAssembler.toEntityFromResource((await api.assignments.create(AssignmentAssembler.toResourceFromEntity(new FleetVehicleAssignment(resource)))).data);
    assignments.value = [...assignments.value, saved];
  }
  return {fleets, assignments, error, fetchFleets, createFleet, assign};
});
