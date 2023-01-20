import User from "@/models/User";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type DesignUpdateRequest = FastifyRequest<{ Body: { gradient: { start: string; end: string; } }}>;
export default async (app: FastifyInstance, req: DesignUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne({ _id: user._id }, { gradient: { start: req.body.gradient.start, end: req.body.gradient.end }  });
    return success(res, null);
};
