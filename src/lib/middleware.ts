import { IRequest } from 'itty-router';

export const withApiKey = async (request: IRequest, env: Env) => {
    if (!env.AUTHENTICATION_ENABLED) {
        return;
    }
    const apiKey = request.query?.apiKey;
    request.apiKey = apiKey;
};
