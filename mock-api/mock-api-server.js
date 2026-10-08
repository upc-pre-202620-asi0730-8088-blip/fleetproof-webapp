import jsonServer from 'json-server';
import fs from 'fs';

export class MockApiServer {
    #config;
    #app;

    constructor(config) {
        this.#config = config;
        this.#ensureDatabaseFile();
        this.#app = this.#buildApp();
    }

    start() {
        return this.#app.listen(this.#config.port, this.#config.host, () => {
            console.log(`FleetProof Mock API running on ${this.#config.host}:${this.#config.port}/api/v1`);
        });
    }

    #ensureDatabaseFile() {
        if (!fs.existsSync(this.#config.dbPath)) {
            fs.writeFileSync(this.#config.dbPath, JSON.stringify({users: [], vehicles: [], reports: [], cases: [], subscriptions: [], fleets: [], assignments: [], monitorings: [], alerts: []}, null, 2));
        }
    }

    #buildApp() {
        const app = jsonServer.create();
        const router = jsonServer.router(this.#config.dbPath);

        app.get('/', (_req, res) => res.json({resources: Object.keys(this.#resourceState(router))}));
        app.use(jsonServer.defaults());
        app.use(jsonServer.bodyParser);
        app.get('/api/v1/health', (_req, res) => res.json({status: 'ok', time: new Date().toISOString()}));
        app.use(jsonServer.rewriter({'/api/v1/authentication/sign-up': '/users', '/api/v1/*': '/$1', '/api/v1': '/'}));
        app.use(router);

        return app;
    }

    #resourceState(router) {
        return typeof router.db.getState === 'function' ? router.db.getState() : router.db.data;
    }
}
