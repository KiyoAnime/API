import success from '@/res/success';
import config from 'config';
import { FastifyReply, FastifyRequest } from 'fastify';

export default (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    const dev = process.argv.includes('--dev');
    const params = new URLSearchParams({
        prompt: 'none',
        response_type: 'code',
        scope: 'identify guilds guilds.join',
        client_id: config.get('discord.clientId'),
        redirect_uri: dev ? 'http://127.0.0.1:3000/callback/discord' : config.get('discord.callback')
    });
    return success(res, `https://discord.com/oauth2/authorize?${params}`);
};
