import axios from 'axios';

export class BaseApi {
  #http;
  constructor() {
    this.#http = axios.create({
      baseURL: import.meta.env.VITE_FLEETPROOF_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    this.#http.interceptors.response.use(response => response, error => {
      if (error.response?.status === 401 && error.config?.headers?.Authorization) {
        localStorage.removeItem('fleetproof-token');
        localStorage.removeItem('fleetproof-session');
        if (window.location.pathname !== '/login') window.location.replace('/login');
      }
      return Promise.reject(error);
    });
  }
  get http() { return this.#http; }
}
