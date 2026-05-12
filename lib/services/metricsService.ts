import http from "http";
import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
    register,
});

const server = http.createServer(async (req, res) => {
    if (req.url !== "/metrics") {
        res.statusCode = 404;
        res.end("Not found");
        return;
    }

    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
});

const port = 25005;
const host = "0.0.0.0";

server.listen(port, host, () => {
    console.log(`Metrics server listening on ${host}:${port}`);
});