import {AsyncLocalStorage} from 'async_hooks';
import HyperExpress from 'hyper-express';
import {default as config} from '../config/local.json';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg: unknown) {
    const id = asyncLocalStorage.getStore();
    console.log(`[${id}] ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
}

async function main() {
    console.log('Start server');
    try {
        const PORT: number = config.server.port;
        const webServer = new HyperExpress.Server();
        webServer.get('/', async (req, res) => {
            res.send('Hello World');
        });

        webServer.post('/nxcommand/commands/:nxcmd', async (req, res) => {
            asyncLocalStorage.run(req.header('x-request-id') ?? Date.now(), async () => {
                const nxcmd = req.params.nxcmd;
                logWithId(nxcmd);
                const reqBody = await req.json();
                logWithId(reqBody);
                res.send(reqBody);
            });
        });
        await webServer.listen(PORT);
        console.log('WebServer started on port', PORT);
    } catch (ex) {
        console.log('WebServer failed to start', ex);
    }
}
main();
