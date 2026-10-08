import path from 'path';
import {fileURLToPath} from 'url';
import {MockApiServerConfig} from './mock-api-server-config.js';
import {MockApiServer} from './mock-api-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = new MockApiServerConfig({
    port: process.env.PORT || 3000,
    host: process.env.HOST || '127.0.0.1',
    dbPath: process.env.JSON_SERVER_DB_PATH || path.join(__dirname, 'db.json')
});

new MockApiServer(config).start();
