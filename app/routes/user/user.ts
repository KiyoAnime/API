import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const user = await getUser(req);
    return success(res, user);
};
