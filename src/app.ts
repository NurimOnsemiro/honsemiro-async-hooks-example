import HyperExpress from 'hyper-express';
const webServer = new HyperExpress.Server();

webServer.get('/', async (req, res) => {
    res.send('Hello World');
});

webServer.post('/', async (req, res) => {
    const reqBody = await req.json();
    console.log(reqBody);
    res.send('Hello World');
});

(async () => {
    try {
        const socket = await webServer.listen(80);
        console.log('WebServer started on port 80');
    } catch (ex) {
        console.log('WebServer failed to start', ex);
    }
})();
