import User from '@/models/User';
import badRequest from '@/res/badRequest';
import success from '@/res/success';
import getUser from '@/utilities/getUser';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export type UserUpdateRequest = FastifyRequest<{
    Body: {
        email: string;
        avatar: string;
        profileName: string;
    };
}>;
export default async (app: FastifyInstance, req: UserUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne(
        { _id: user?._id },
        {
            email: req.body.email,
            avatar: req.body.avatar,
            profileName: req.body.profileName
        }
    );
    return success(res, null);
};

export const validation = (req: UserUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.email) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'email' paramater is undefined");
    if (!req.body.avatar) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'avatar' paramater is undefined");
    if (!req.body.profileName) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'profileName' paramater is undefined");
    next();
};
