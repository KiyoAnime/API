import badRequest from '@/res/badRequest';
import { LoginRequest } from '@/routes/auth/login';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';

export default (req: LoginRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.email) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'email' paramater is undefined.");
    if (!req.body.password) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'password' paramater is undefined.");
    next();
};
