import badRequest from '@/res/badRequest';
import { SearchRequest } from '@/routes/search';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';

export default (req: SearchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.query.query) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'query' query paramater is undefined.");
    next();
};
