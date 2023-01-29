import { FastifyReply } from "fastify";

export default (res: FastifyReply, data: any) => {
    return res.status(200).send({ error: false, code: 'SUCCESS', data });
};
