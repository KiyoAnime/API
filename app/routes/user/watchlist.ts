import Watchlist from "@/models/Watchlist";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyReply, FastifyRequest } from "fastify";

export default async (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    const user = await getUser(req);
    const watchlist = await Watchlist.find({ user: user._id });
    return success(res, watchlist);
};

