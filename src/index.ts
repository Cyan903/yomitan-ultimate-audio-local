import http from "http";
import router from "./routes/router";
import initDB from "./local/db";

import "dotenv/config";

const PORT = parseInt(process.env.PORT);
const HOST = process.env.HOST;

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `${HOST}:${PORT}`);
    const request = new Request(url, { method: req.method });
    const DB = await initDB();

    const response = await router
        .fetch(request, {
            AUTHENTICATION_ENABLED: process.env.AUTHENTICATION_ENABLED == "true",
            API_KEYS: process.env.API_KEYS,
            HOST_URL: process.env.HOST_URL,
            DB,

            // Polly
            AWS_POLLY_ENABLED: process.env.AWS_POLLY_ENABLED == "true",
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        })
        .catch((err: Error) => new Response(err.message, { status: 500 }));

    const body = await response.arrayBuffer();

    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(body));
});

server.listen(PORT, () => console.log(`yomitan-ultimate-audio-local on ${HOST}:${PORT}`));
