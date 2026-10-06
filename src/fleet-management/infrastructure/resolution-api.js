import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
export class ResolutionApi extends BaseApi {
  #cases;
  constructor() { super(); this.#cases = new BaseEndpoint(this, import.meta.env.VITE_CASES_ENDPOINT_PATH || '/cases'); }
  getCases() { return this.#cases.getAll(); }
  createCase(resource) { return this.#cases.create(resource); }
  updateCase(resource) { return this.#cases.update(resource.id, resource); }
}

