export class MockApiServerConfig {
    #port;
    #dbPath;
    #host;

    constructor({port, dbPath, host = '127.0.0.1'}) {
        this.#port = Number(port);
        this.#dbPath = dbPath;
        this.#host = host;
    }

    get port() {
        return this.#port;
    }

    get dbPath() {
        return this.#dbPath;
    }
    get host() { return this.#host; }
}
