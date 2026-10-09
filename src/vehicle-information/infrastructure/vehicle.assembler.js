import { Vehicle } from '../../../../../Desktop/CICLO 2026-2/Aplicaciones Web/FleetProof-frontend/src/vehicle-information/domain/model/vehicle.entity.js';
export class VehicleAssembler {
  static toEntityFromResource(resource) { return new Vehicle(resource); }
  static toResourceFromEntity(entity) {
    const { id, plate, type, site, owner, risk, monitored } = entity;
    return { ...(id !== undefined ? { id } : {}), plate, type, site, owner, risk, monitored };
  }
  static toEntitiesFromResponse(response) { return response.data.map(resource => this.toEntityFromResource(resource)); }
}

