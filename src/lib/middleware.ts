import { IRequest } from "itty-router";

export const withApiKey = async (request: IRequest, env: Env) => {
    if (!env.AUTHENTICATION_ENABLED) {
        return;
    }

    request.apiKey = request.query?.apiKey;
};
