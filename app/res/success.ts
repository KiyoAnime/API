import { FastifyReply } from "fastify";

export default (res: FastifyReply, data: any, cookie?: { key: string, value: string }) => {
    if (cookie) {
        return res.status(200).setCookie(cookie.key, cookie.value, { path: '/', httpOnly: true, sameSite: 'none' }).send({ error: false, code: 'SUCCESS', data });
    } else {
        return res.status(200).send({ error: false, code: 'SUCCESS', data });
    };
};