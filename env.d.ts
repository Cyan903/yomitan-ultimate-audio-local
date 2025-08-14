import { Database } from "sqlite";

declare global {
    interface Env {
        AUTHENTICATION_ENABLED: true;
        API_KEYS: string;
        DB: Database;

        // Polly
        AWS_POLLY_ENABLED: true;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
    }
}
