import badRequest from '@/res/badRequest';
import { WatchRequest } from '@/routes/watch';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';

export default (req: WatchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    next();
};
