import useIamStore from "../application/iam.store.js";

/**
 * Adds the IAM bearer token to outbound requests when a user is authenticated.
 *
 * @param {import('axios').InternalAxiosRequestConfig} config - Axios request configuration.
 * @returns {import('axios').InternalAxiosRequestConfig} Updated request configuration.
 */
export const iamInterceptor = (config) => {
    const store = useIamStore();
    if (store.isSignedIn) {
        config.headers.Authorization = `Bearer ${store.currentToken}`;
    }
    return config;
}
