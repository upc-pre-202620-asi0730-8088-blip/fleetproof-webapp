/**
 * Sends credentials to the mock API authentication endpoint without putting
 * passwords in query strings or exposing the users collection.
 *
 * @class FakeSignInEndpoint
 */
export class FakeSignInEndpoint {
    #http;
    #usersEndpointPath;

    /**
     * @param {import('../../shared/infrastructure/base-api.js').BaseApi} baseApi - Configured API client owner.
     * @param {string} usersEndpointPath - Relative path to the users collection.
     */
    constructor(baseApi, usersEndpointPath) {
        this.#http = baseApi.http;
        this.#usersEndpointPath = usersEndpointPath;
    }

    /**
     * Requests a temporary session from the mock API.
     * @param {{username: string, password: string}} signInRequest - Sign-in request payload.
     * @returns {Promise<{status: number, statusText: string, data: Object|null}>} Response shaped like the real sign-in endpoint's, so {@link SignInAssembler} can read either one.
     */
    async create(signInRequest) {
        return this.#http.post('/authentication/sign-in', signInRequest);
    }
}
