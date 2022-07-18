import {AsyncLocalStorage} from 'async_hooks';
import HyperExpress from 'hyper-express';
const webServer = new HyperExpress.Server();

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg: string) {
    const id = asyncLocalStorage.getStore();
    console.log(`[${id}] ${msg}`);
}

webServer.get('/', async (req, res) => {
    res.send('Hello World');
});

webServer.post('/', async (req, res) => {
    asyncLocalStorage.run(req.header('x-request-id') ?? Date.now(), async () => {
        logWithId('a1');
        setImmediate(async () => {
            logWithId('a2');

            const reqBody = await req.json();
            console.log(reqBody);
            res.send('Hello World');
        });
    });
});

(async () => {
    try {
        await webServer.listen(80);
        console.log('WebServer started on port 80');
    } catch (ex) {
        console.log('WebServer failed to start', ex);
    }
})();
