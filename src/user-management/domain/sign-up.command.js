/**
 * Command used by the IAM application layer to register a new user.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    #username;
    #password;

    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.username - Desired username.
     * @param {string} params.password - Desired password.
     */
    constructor({username, password}) {
        this.#username = username;
        this.#password = password;
    }

    /** @returns {string} Desired username. */
    get username() {
        return this.#username;
    }

    /** @returns {string} Desired password. */
    get password() {
        return this.#password;
    }
}

