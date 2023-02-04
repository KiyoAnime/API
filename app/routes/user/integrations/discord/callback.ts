import badRequest from "@/res/badRequest";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import config from 'config';
import axios from "axios";
import User from "@/models/User";
import { sign } from "jsonwebtoken";
import success from "@/res/success";
import getUser from "@/utilities/getUser";

export type DiscordCallbackRequest = FastifyRequest<{ Body: { code: string } }>;
export default (app: Instance, req: DiscordCallbackRequest, res: FastifyReply) => {
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
        code: req.body.code,
        redirect_uri: redirect,
        grant_type: 'authorization_code',
        client_id: config.get('discord.clientId'),
        client_secret: process.env.DISCORD_CLIENT_SECRET!
    });
    axios.post(`https://discord.com/api/v10/oauth2/token`, params).then(async (oauthToken) => {
        const info = await axios.get('https://discord.com/api/v10/users/@me', { headers: {
            Authorization: `Bearer ${oauthToken.data.access_token}`,
        }});
        const user = await User.findOne({ 'integrations.discord.id': info.data.id });
        if (user) {
            await User.findByIdAndUpdate(user._id, { $set: { 'integrations.discord.tag': `${info.data.username}#${info.data.discriminator}` } });
            const token = sign(user._id.toString(), process.env.APP_SECRET!);
            return success(res, { type: 'LOGIN', cookie: { key: 'token', value: token } });
        } else {
            const authUser = await getUser(req);
            await User.findByIdAndUpdate(authUser._id, { $set: {
                'integrations.discord.id': info.data.id,
                'integrations.discord.tag': `${info.data.username}#${info.data.discriminator}`
            } });
            return success(res, { type: 'LINK' });
        }
    }).catch((err) => badRequest(res, 'ERR.PARAM.INVALID', `The specified access code invalid. Meta: ${JSON.stringify(err.response.data)}`));
};

export const validation = (req: DiscordCallbackRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined.');
    if (!req.body.code) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'code' paramater is undefined.");
    next();
};
