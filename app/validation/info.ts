import badRequest from "@/res/badRequest";
import { InfoRequest } from "@/routes/info";
import { FastifyReply, HookHandlerDoneFunction } from "fastify";

const infoValidation = (req: InfoRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params?.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The \'id\' paramater is undefined.');
    next();
};

export default infoValidation;
