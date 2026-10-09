import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
export class ReportingApi extends BaseApi {
  #reports;
  constructor() { super(); this.#reports = new BaseEndpoint(this, import.meta.env.VITE_REPORTS_ENDPOINT_PATH || '/reports'); }
  getReports() { return this.#reports.getAll(); }
  createReport(resource) { return this.#reports.create(resource); }
  updateReport(resource) { return this.#reports.update(resource.id, resource); }
}

