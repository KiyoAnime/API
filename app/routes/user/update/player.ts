import User from '@/models/User';
import badRequest from '@/res/badRequest';
import success from '@/res/success';
import getUser from '@/utilities/getUser';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export type PlayerUpdateRequest = FastifyRequest<{
    Body: {
        autoNext: boolean;
        autoSkip: boolean;
    };
}>;
export default async (app: Instance, req: PlayerUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    // prettier-ignore
    await User.findByIdAndUpdate(user._id, { $set: {
        'config.autoNext': req.body.autoNext,
        'config.autoSkip': req.body.autoSkip
    }});
    return success(res, null);
};

export const validation = (req: PlayerUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (typeof req.body.autoNext !== 'boolean') return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'autoNext' paramater is undefined.");
    if (typeof req.body.autoSkip !== 'boolean') return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'autoSkip' paramater is undefined.");
    next();
};
