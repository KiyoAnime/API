import User from "@/models/User";
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type DesignUpdateRequest = FastifyRequest<{ Body: {
    publicEmail: string;
    publicProfile: string;
}}>;
export default async (app: FastifyInstance, req: DesignUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne({ _id: user._id }, {
        config: {
            publicEmail: req.body.publicEmail,
            publicProfile: req.body.publicProfile
        }
    });
    return success(res, null);
};

export const validation = (req: DesignUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.publicEmail) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'publicEmail' paramater is undefined");
    if (!req.body.publicProfile) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'publicProfile' paramater is undefined");
};
