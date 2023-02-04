import badRequest from "@/res/badRequest";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import config from 'config';
import axios from "axios";
import User from "@/models/User";
import { sign } from "jsonwebtoken";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import unauthorized from "@/res/unauthorized";
import getCallback from "@/utilities/getCallback";

export type DiscordCallbackRequest = FastifyRequest<{ Body: { code: string } }>;
export default async (app: Instance, req: DiscordCallbackRequest, res: FastifyReply) => {
    const params = new URLSearchParams({
        code: req.body.code,
        redirect_uri: getCallback(),
        grant_type: 'authorization_code',
        client_id: config.get('discord.clientId'),
        client_secret: process.env.DISCORD_CLIENT_SECRET!
    });
    const oauthToken = await axios.post(`https://discord.com/api/v10/oauth2/token`, params);
    const info = await axios.get('https://discord.com/api/v10/users/@me', { headers: {
        Authorization: `Bearer ${oauthToken.data.access_token}`,
    }});
    const user = await User.findOne({ 'integrations.discord.id': info.data.id });
    if (user) {
        await User.findByIdAndUpdate(user._id, { $set: { 'integrations.discord.tag': `${info.data.username}#${info.data.discriminator}` } });
        const token = sign(user._id.toString(), process.env.APP_SECRET!);
        return success(res, { type: 'LOGIN', cookie: { key: 'token', value: token } });
    } else {
        await getUser(req).then(async (authUser) => {
            await User.findByIdAndUpdate(authUser._id, { $set: {
                'integrations.discord.id': info.data.id,
                'integrations.discord.tag': `${info.data.username}#${info.data.discriminator}`
            } });
            return success(res, { type: 'LINK' });
        }).catch(() => unauthorized(res, 'ERR.AUTHORIZATION.UNDEFINED', 'The specified Discord Account is not linked to a Kiyo Account.'));
    }
};

export const validation = (req: DiscordCallbackRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined.');
    if (!req.body.code) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'code' paramater is undefined.");
    next();
};
