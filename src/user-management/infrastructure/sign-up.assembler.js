import {SignUpResource} from "./sign-up.resource.js";

/**
 * Maps registration endpoint responses into IAM infrastructure resources.
 *
 * @class SignUpAssembler
 */
export class SignUpAssembler {
    /**
     * @param {import('../domain/sign-up.command.js').SignUpCommand} command - Sign-up command.
     * @returns {{username: string, password: string}} Sign-up request payload.
     */
    static toRequestFromCommand(command) {
        return {username: command.username, password: command.password};
    }

    /**
     * @param {import('axios').AxiosResponse<Object>} response - HTTP response from sign-up endpoint.
     * @returns {SignUpResource|null} Parsed resource when the response is successful; otherwise null.
     * @remarks
     * Accepts any 2xx status: the real endpoint answers 200, while the fake API's `users`
     * collection answers 201 Created when the sign-up is routed straight to it in development.
     */
    static toResourceFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return new SignUpResource(response.data);
    }
}
