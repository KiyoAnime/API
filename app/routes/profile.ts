import User from "@/models/User";
import success from "@/res/success";
import userNotfound from "@/res/userNotfound";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type UserSearchRequest = FastifyRequest<{ Querystring: { username: string } }>;
export default async (app: FastifyInstance, req: UserSearchRequest, res: FastifyReply) => {
    const username = req.query.username;
    const user = await User.findOne({ profileName: username });
    if (!user) return userNotfound(res, "ERR.USER_NOT_FOUND", "The user you are looking for does not exist.")
    return success(res, user);
};