/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_AUTH_MODE?: 'mock' | 'real';
  readonly VITE_FLEETPROOF_API_URL?: string;
  readonly VITE_VEHICLES_ENDPOINT_PATH?: string;
  readonly VITE_REPORTS_ENDPOINT_PATH?: string;
  readonly VITE_CASES_ENDPOINT_PATH?: string;
  readonly VITE_SIGNIN_ENDPOINT_PATH?: string;
  readonly VITE_SIGNUP_ENDPOINT_PATH?: string;
  readonly VITE_USERS_ENDPOINT_PATH?: string;
  readonly VITE_PRIME_UI_LICENSE_KEY?: string;
  readonly VITE_SUBSCRIPTIONS_ENDPOINT_PATH?: string;
  readonly VITE_FLEETS_ENDPOINT_PATH?: string;
  readonly VITE_ASSIGNMENTS_ENDPOINT_PATH?: string;
  readonly VITE_MONITORINGS_ENDPOINT_PATH?: string;
  readonly VITE_ALERTS_ENDPOINT_PATH?: string;
}
