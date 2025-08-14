import http from "http";
import router from "./routes/router"
import initDB from "./local/db"

// TODO: Don't hardcode
const PORT = 3000;
const HTTP = "http";

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `${HTTP}://${req.headers.host}`);
    const request = new Request(url, { method: req.method });
    const DB = await initDB();

    const response = await router
        .fetch(request, {
            AUTHENTICATION_ENABLED: true,
            API_KEYS: "abc,123",
            DB,

            // Polly
            AWS_POLLY_ENABLED: true,
            AWS_ACCESS_KEY_ID: "",
            AWS_SECRET_ACCESS_KEY: "",
        })
        .catch((err: Error) => new Response(err.message, { status: 500 }));

    const body = await response.arrayBuffer();

    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(body));
});

server.listen(PORT, () => {
    console.log(`Running on :${PORT}`);
});
