import axios from 'axios';
import { iamInterceptor } from '../../iam/infrastructure/iam.interceptor.js';

export class BaseApi {
  #http;
  constructor() {
    this.#http = axios.create({
      baseURL: import.meta.env.VITE_FLEETPROOF_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    this.#http.interceptors.request.use(iamInterceptor);
  }
  get http() { return this.#http; }
}
