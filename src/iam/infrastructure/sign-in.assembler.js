import {SignInResource} from "./sign-in.resource.js";

/**
 * Maps authentication endpoint responses into IAM infrastructure resources.
 *
 * @class SignInAssembler
 */
export class SignInAssembler {
    /**
     * @param {import('../domain/sign-in.command.js').SignInCommand} command - Sign-in command.
     * @returns {{username: string, password: string}} Sign-in request payload.
     */
    static toRequestFromCommand(command) {
        return {username: command.username, password: command.password};
    }

    /**
     * @param {import('axios').AxiosResponse<Object>} response - HTTP response from sign-in endpoint.
     * @returns {SignInResource|null} Parsed resource when the response is successful; otherwise null.
     */
    static toResourceFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return new SignInResource(response.data);
    }
}
