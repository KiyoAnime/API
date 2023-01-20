import badRequest from "@/res/badRequest";
import { DesignUpdateRequest } from "@/routes/user/update/profile/design";
import { FastifyReply, HookHandlerDoneFunction } from "fastify";

export default (req: DesignUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.gradient) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient' paramater is undefined");
    if (!req.body.gradient.end) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient.end' paramater is undefined");
    if (!req.body.gradient.start) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'gradient.start' paramater is undefined");
    next();
};
