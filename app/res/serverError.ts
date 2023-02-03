import { FastifyReply } from 'fastify';

export default (res: FastifyReply, code: Code, data: any) => {
    return res.status(500).send({ error: true, code, data });
};

type Code = 'ERR.REQUEST_FAILED' | 'ERR.PROVIDER_DOWN' | 'ERR.CACHE.NULL';
