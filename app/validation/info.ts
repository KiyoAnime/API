import badRequest from '@/res/badRequest';
import { InfoRequest } from '@/routes/info/info';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';

export default (req: InfoRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    next();
};
