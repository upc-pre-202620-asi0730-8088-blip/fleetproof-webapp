import { Fleet, FleetVehicleAssignment } from '../domain/model/fleet.entity.js';
export class FleetAssembler {
  static toEntityFromResource(r) { return new Fleet(r); }
  static toResourceFromEntity(e) { return {id:e.id, name:e.name}; }
}
export class AssignmentAssembler {
  static toEntityFromResource(r) { return new FleetVehicleAssignment(r); }
  static toResourceFromEntity(e) { return {id:e.id, fleetId:e.fleetId, vehicleId:e.vehicleId, responsible:e.responsible}; }
}
