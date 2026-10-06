/**
 * Command used by the IAM application layer to request authentication.
 *
 * @class SignInCommand
 */
export class SignInCommand {
    #username;
    #password;

    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.username - Username credential.
     * @param {string} params.password - Password credential.
     */
    constructor({username, password}) {
        this.#username = username;
        this.#password = password;
    }

    /** @returns {string} Username credential. */
    get username() {
        return this.#username;
    }

    /** @returns {string} Password credential. */
    get password() {
        return this.#password;
    }
}
