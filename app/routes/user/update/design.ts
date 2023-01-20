import User from "@/models/User";
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type DesignUpdateRequest = FastifyRequest<{ Body: { gradient: { start: string; end: string; } }}>;
export default async (app: FastifyInstance, req: DesignUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne({ _id: user._id }, { gradient: { start: req.body.gradient.start, end: req.body.gradient.end }  });
    return success(res, null);
};

export const validation =  (req: DesignUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.gradient) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient' paramater is undefined");
    if (!req.body.gradient.end) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient.end' paramater is undefined");
    if (!req.body.gradient.start) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient.start' paramater is undefined");
    next();
};
