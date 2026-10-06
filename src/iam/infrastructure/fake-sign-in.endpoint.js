/**
 * Simulates sign-in against the `users` collection the fake API serves, for local
 * development only: `json-server` has no endpoint that can verify credentials through
 * a `POST`, so this adapter filters the `users` collection with a `GET` instead.
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
     * Looks up a matching username and password in the fake `users` collection.
     * @param {{username: string, password: string}} signInRequest - Sign-in request payload.
     * @returns {Promise<{status: number, statusText: string, data: Object|null}>} Response shaped like the real sign-in endpoint's, so {@link SignInAssembler} can read either one.
     */
    async create(signInRequest) {
        const response = await this.#http.get(this.#usersEndpointPath, {
            params: {username: signInRequest.username, password: signInRequest.password}
        });
        const matches = response.data;
        if (!Array.isArray(matches) || matches.length === 0) {
            return {status: 401, statusText: 'Invalid username or password', data: null};
        }
        const user = matches[0];
        return {status: 200, statusText: 'OK', data: {id: user.id, username: user.username, token: String(user.id)}};
    }
}
