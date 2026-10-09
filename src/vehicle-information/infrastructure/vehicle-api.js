import { BaseApi } from '../../../../../Desktop/CICLO 2026-2/Aplicaciones Web/FleetProof-frontend/src/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../../../../Desktop/CICLO 2026-2/Aplicaciones Web/FleetProof-frontend/src/shared/infrastructure/base-endpoint.js';
export class VehicleApi extends BaseApi {
  #vehicles;
  constructor() {
    super();
    this.#vehicles = new BaseEndpoint(this, import.meta.env.VITE_VEHICLES_ENDPOINT_PATH || '/vehicles');
  }
  getVehicles() { return this.#vehicles.getAll(); }
  createVehicle(resource) { return this.#vehicles.create(resource); }
  updateVehicle(resource) { return this.#vehicles.update(resource.id, resource); }
}

