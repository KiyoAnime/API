import success from '@/res/success';
import config from 'config';
import { FastifyReply, FastifyRequest } from 'fastify';

export default (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    let redirect = '';
    switch (process.argv[2]) {
        case '--dev':
            redirect = 'http://127.0.0.1:3000/callback/discord'
            break;

        case '--canary':
            redirect = 'https://canary.kiyo.moe/callback/discord'
            break;

        default:
            redirect = 'https://kiyo.moe/callback/discord';
            break;
    };
    const params = new URLSearchParams({
        prompt: 'none',
        response_type: 'code',
        redirect_uri: redirect,
        scope: 'identify guilds guilds.join',
        client_id: config.get('discord.clientId')
    });
    return success(res, `https://discord.com/oauth2/authorize?${params}`);
};
