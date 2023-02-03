import User from '@/models/User';
import badRequest from '@/res/badRequest';
import notFound from '@/res/notFound';
import success from '@/res/success';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export type UserProfileRequest = FastifyRequest<{ Params: { user: string } }>;
export default async (app: FastifyInstance, req: UserProfileRequest, res: FastifyReply) => {
    const user = await User.findOne({ username: req.params.user });
    if (!user || !user.config.publicProfile) return notFound(res, 'ERR.USER.NOTFOUND', 'The specified user was not found.');
    return success(res, user.getProfile());
};

export const validation = (req: UserProfileRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.user) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'user' paramater is undefined.");
    next();
};
