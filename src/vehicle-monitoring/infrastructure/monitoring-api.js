import { BaseApi } from '../../../../../Downloads/FleetProof-frontend/src/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../../../../Downloads/FleetProof-frontend/src/shared/infrastructure/base-endpoint.js';
export class MonitoringApi extends BaseApi {
  constructor(){super(); this.monitorings=new BaseEndpoint(this, import.meta.env.VITE_MONITORINGS_ENDPOINT_PATH || '/monitorings'); this.alerts=new BaseEndpoint(this, import.meta.env.VITE_ALERTS_ENDPOINT_PATH || '/alerts');}
}
