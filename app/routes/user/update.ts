import User from "@/models/User";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type UserUpdateRequest = FastifyRequest<{ Body: {
    email: string;
    avatar: string;
    profileName: string;
}}>;
export default async (app: FastifyInstance, req: UserUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    await User.updateOne({ _id: user?._id }, { email: req.body.email, avatar: req.body.avatar, profileName: req.body.profileName });
    return success(res, null);
};
