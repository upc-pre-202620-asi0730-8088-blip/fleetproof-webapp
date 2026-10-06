/**
 * IAM user aggregate root representation used by the client domain model.
 *
 * @class User
 */
export class User {
    #id;
    #username;

    /**
     * @param {Object} params - Entity attributes.
     * @param {string|number} params.id - Unique user identifier.
     * @param {string} params.username - Public username.
     */
    constructor({id, username}) {
        this.#id = id;
        this.#username = username;
    }

    /** @returns {string|number} Unique user identifier. */
    get id() {
        return this.#id;
    }

    /** @returns {string} Public username. */
    get username() {
        return this.#username;
    }
}
