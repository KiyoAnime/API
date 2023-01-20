import User from "@/models/User";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

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
