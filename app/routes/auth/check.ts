import User from "@/models/User";
import success from "@/res/success";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type CheckRequest = FastifyRequest<{ Body: { email: string } }>;
export default async (app: FastifyInstance, req: CheckRequest, res: FastifyReply) => {
    const user = await User.exists({ email: req.body.email });
    if (user) return success(res, true); else return success(res, false);
};
