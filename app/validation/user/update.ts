import badRequest from "@/res/badRequest";
import { UserUpdateRequest } from "@/routes/user/update/user";
import { FastifyReply, HookHandlerDoneFunction } from "fastify";

export default (req: UserUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined');
    if (!req.body.email) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'email' paramater is undefined");
    if (!req.body.avatar) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'avatar' paramater is undefined");
    if (!req.body.profileName) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'profileName' paramater is undefined");
    next();
};
