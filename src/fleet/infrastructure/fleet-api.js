import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
export class FleetApi extends BaseApi {
  #vehicles;
  constructor() {
    super();
    this.#vehicles = new BaseEndpoint(this, import.meta.env.VITE_VEHICLES_ENDPOINT_PATH || '/vehicles');
  }
  getVehicles() { return this.#vehicles.getAll(); }
  createVehicle(resource) { return this.#vehicles.create(resource); }
  updateVehicle(resource) { return this.#vehicles.update(resource.id, resource); }
}

