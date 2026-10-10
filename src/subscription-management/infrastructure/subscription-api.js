import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
export class SubscriptionApi extends BaseApi {
    constructor() { super(); this.endpoint = new BaseEndpoint(this, import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH || '/subscriptions'); }
    getAll() { return this.endpoint.getAll(); }
    save(resource) { return resource.id === undefined ? this.endpoint.create(resource) : this.endpoint.update(resource.id, resource); }
}
