import http from "http";
import router from "./routes/router"

// TODO: Don't hardcode
const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // TODO: http should probably not be hardcoded
    const url = new URL(req.url || "/", "http://${req.headers.host}");
    const request = new Request(url, { method: req.method });

    const response = await router
        .fetch(request, {
            AUTHENTICATION_ENABLED: true,
            API_KEYS: "abc,123",

            // Polly
            AWS_POLLY_ENABLED: false,
            AWS_ACCESS_KEY_ID: "",
            AWS_SECRET_ACCESS_KEY: "",
        })
        .catch((err: Error) => new Response(err.message, { status: 500 }));

    const body = await response.text();

    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(body);
});

server.listen(PORT, () => {
    console.log(`Running on :${PORT}`);
});
