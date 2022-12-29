import { FastifyReply } from "fastify";

export default (res: FastifyReply, code: Code, data: any) => {
    return res.status(400).send({ error: true, code, data });
};

type Code = 'ERR.PARAM.UNDEFINED'|'ERR.QUERY.UNDEFINED'|'ERR.BODY_PARAM.UNDEFINED';