import User from "@/models/User";
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type BioUpdateRequest = FastifyRequest<{ Body: { bio: string; }}>;
export default async (app: FastifyInstance, req: BioUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne({ _id: user._id }, {
        profile: { bio: req.body.bio }
    });
    return success(res, null);
};

export const validation = (req: BioUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.bio) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'bio' paramater is undefined");
    next();
};
