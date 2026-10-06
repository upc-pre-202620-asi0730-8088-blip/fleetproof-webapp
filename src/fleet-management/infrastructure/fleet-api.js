import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
export class FleetApi extends BaseApi {
  constructor() { super(); this.fleets = new BaseEndpoint(this, import.meta.env.VITE_FLEETS_ENDPOINT_PATH || '/fleets'); this.assignments = new BaseEndpoint(this, import.meta.env.VITE_ASSIGNMENTS_ENDPOINT_PATH || '/assignments'); }
}
