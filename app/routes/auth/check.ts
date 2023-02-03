import User from '@/models/User';
import badRequest from '@/res/badRequest';
import success from '@/res/success';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export type CheckRequest = FastifyRequest<{ Body: { email: string } }>;
export default async (app: FastifyInstance, req: CheckRequest, res: FastifyReply) => {
    const user = await User.exists({ email: req.body.email });
    if (user) return success(res, true);
    else return success(res, false);
};

export const validation = (req: CheckRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.email) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'email' paramater is undefined.");
    next();
};
