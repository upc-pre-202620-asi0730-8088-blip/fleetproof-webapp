import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {FakeSignInEndpoint} from "./fake-sign-in.endpoint.js";
const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH || '/authentication/sign-in';
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH || '/authentication/sign-up';
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH || '/users';

/**
 * Infrastructure API client for IAM bounded-context endpoints.
 *
 * @class IamApi
 * @extends BaseApi
 */
export class IamApi extends BaseApi {
    #signInEndpoint;
    #signUpEndpoint;
    #usersEndpoint;

    /**
     * Creates endpoint clients for sign-in, sign-up, and user listing.
     *
     * @remarks
     * In production this uses the real sign-in endpoint. In development, no such backend
     * exists yet, so it falls back to {@link FakeSignInEndpoint}, which simulates sign-in
     * against the fake API's `users` collection instead.
     */
    constructor() {
        super();
        const mockAuthentication = import.meta.env.VITE_AUTH_MODE === 'mock' ||
            (import.meta.env.DEV && import.meta.env.VITE_AUTH_MODE !== 'real');
        this.#signInEndpoint = !mockAuthentication
            ? new BaseEndpoint(this, signInEndpointPath)
            : new FakeSignInEndpoint(this, usersEndpointPath);
        this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Sends a sign-in command to the authentication endpoint.
     * @param {import('../domain/sign-in.command.js').SignInCommand} signInRequest - Sign-in command.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} HTTP response with authentication payload.
     */
    signIn(signInRequest) {
        return this.#signInEndpoint.create(signInRequest);
    }

    /**
     * Sends a sign-up command to the registration endpoint.
     * @param {import('../domain/sign-up.command.js').SignUpCommand} signUpRequest - Sign-up command.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} HTTP response with registration payload.
     */
    signUp(signUpRequest) {
        return this.#signUpEndpoint.create(signUpRequest);
    }

    /**
     * Retrieves users visible to the IAM context.
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|Object>>} HTTP response with user resources.
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}
