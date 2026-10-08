import { randomBytes } from 'node:crypto';

export function installUserAccess(app, router) {
    const sessions = new Map();
    const state = router.db.getState();
    let admin = state.users.find(user => user.username === 'etepepe');
    if (!admin) {
        admin = {id: randomBytes(12).toString('hex'), username: 'etepepe'};
        state.users.push(admin);
    }
    admin.password = '12345678';
    admin.role = 'admin';
    for (const [collection, records] of Object.entries(state)) {
        if (collection === 'users') continue;
        for (const record of records) if (!record.userId) record.userId = admin.id;
    }
    router.db.setState(state).write();

    app.post('/api/v1/authentication/sign-in', (req, res) => {
        const user = router.db.getState().users.find(item =>
            item.username === req.body.username && item.password === req.body.password);
        if (!user) return res.status(401).json({message: 'Invalid credentials'});
        const token = randomBytes(32).toString('hex');
        sessions.set(token, {id: user.id, expires: Date.now() + 86400000});
        res.json({id: user.id, username: user.username, role: user.role || 'user', token});
    });
    app.post('/api/v1/authentication/sign-up', (req, res) => {
        const {username, password} = req.body;
        if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || password.length < 8)
            return res.status(400).json({message: 'Invalid registration'});
        if (router.db.getState().users.some(user => user.username === username.trim()))
            return res.status(409).json({message: 'Username already exists'});
        router.db.get('users').push({id: randomBytes(12).toString('hex'), username: username.trim(), password, role: 'user'}).write();
        res.status(201).json({message: 'Account created'});
    });
    app.use((req, res, next) => {
        if (req.path === '/' || req.path === '/api/v1/health') return next();
        const session = sessions.get((req.headers.authorization || '').replace(/^Bearer /, ''));
        const user = session && session.expires > Date.now() && router.db.getState().users.find(item => String(item.id) === String(session.id));
        if (!user) return res.status(401).json({message: 'Sign in required'});
        const [collection, id, ...nested] = req.path.replace(/^\/api\/v1\/?/, '').split('/');
        if (collection === 'users' || nested.length || !Array.isArray(router.db.getState()[collection]))
            return res.status(403).json({message: 'Forbidden'});
        if (Object.keys(req.query).some(key => key.startsWith('_')))
            return res.status(400).json({message: 'Unsupported query'});
        const records = router.db.getState()[collection];
        if (id) {
            const record = records.find(item => String(item.id) === id);
            if (!record || String(record.userId) !== String(user.id)) return res.status(404).json({message: 'Not found'});
        }
        if (req.method === 'GET' && !id) req.query.userId = user.id;
        if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
            req.body.userId = user.id;
            for (const [field, target] of [['vehicleId', 'vehicles'], ['fleetId', 'fleets'], ['reportId', 'reports'], ['monitoringId', 'monitorings']]) {
                if (req.body[field] == null) continue;
                if (!router.db.getState()[target].some(item => String(item.id) === String(req.body[field]) && String(item.userId) === String(user.id)))
                    return res.status(403).json({message: 'Invalid related record'});
            }
        }
        next();
    });
}
