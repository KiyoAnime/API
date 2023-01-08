import { FastifyReply } from "fastify";

export default (res: FastifyReply, code: Code, data: any) => {
    return res.status(401).send({ error: true, code, data });
};

type Code = 'ERR.AUTHORIZATION.UNDEFINED' | 'ERR.AUTHORIZATION.INVALID';