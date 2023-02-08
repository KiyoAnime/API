import Watchlist from "@/models/Watchlist";
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import { genId } from "@/utilities/gen";
import getUser from "@/utilities/getUser";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type WatchlistUpdateRequest = FastifyRequest<{ Body: { end: string; start: string; anime: number; status: string } }>;
export default async (app: Instance, req: WatchlistUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    if (await Watchlist.exists({ user: user._id, anime: req.body.anime })) {
        await Watchlist.updateOne({ user: user._id, anime: req.body.anime }, { $set: {
            end: req.body.end,
            start: req.body.start,
            status: req.body.status
        }});
        return success(res, null);
    } else {
        await Watchlist.create({
            _id: genId(),
            user: user._id,
            anime: req.body.anime,
            end: req.body.end,
            start: req.body.start,
            status: req.body.status
        });
        return success(res, null);
    }
};

export const validation = (req: WatchlistUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined.');
    if (!req.body.end) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'end' paramater is undefined.");
    if (!req.body.start) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'start' paramater is undefined.");
    if (!req.body.anime) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'anime' paramater is undefined.");
    if (!req.body.status) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'status' paramater is undefined.");
    next();
};
