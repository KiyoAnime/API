import success from '@/res/success';
import getCallback from '@/utilities/getCallback';
import config from 'config';
import { FastifyReply, FastifyRequest } from 'fastify';

export default (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    const params = new URLSearchParams({
        prompt: 'none',
        response_type: 'code',
        redirect_uri: getCallback(),
        scope: 'identify guilds guilds.join',
        client_id: config.get('discord.clientId')
    });
    return success(res, `https://discord.com/oauth2/authorize?${params}`);
};
