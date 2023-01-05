import badRequest from "@/res/badRequest";
import { CheckRequest } from "@/routes/auth/check";
import { FastifyReply, HookHandlerDoneFunction } from "fastify";

export default (req: CheckRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.email) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'email' paramater is undefined.");
    next();
};
