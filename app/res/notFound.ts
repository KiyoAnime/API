import { FastifyReply } from 'fastify';

export default (res: FastifyReply, code: Code, data: any) => {
    return res.status(404).send({ error: true, code, data });
};

type Code = 'ERR.USER.NOTFOUND' | 'ERR.EPISODE.NOTFOUND';
