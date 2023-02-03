import Progress from '@/models/Progress';
import badRequest from '@/res/badRequest';
import success from '@/res/success';
import { genId } from '@/utilities/gen';
import getUser from '@/utilities/getUser';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export type ProgressUpdateRequest = FastifyRequest<{ Body: { id: number; episode: number; progress: number } }>;
export default async (app: Instance, req: ProgressUpdateRequest, res: FastifyReply) => {
    const user = await getUser(req);
    if (!(await Progress.exists({ user: user._id, anime: req.body.id, episode: req.body.episode }))) {
        const id = genId();
        await Progress.create({ _id: id, user: user._id, anime: req.body.id, episode: req.body.episode, progress: req.body.progress });
        return success(res, null);
    } else {
        await Progress.updateOne({ user: user._id, anime: req.body.id }, { episode: req.body.episode, progress: req.body.progress });
        return success(res, null);
    }
};

export const validation = (req: ProgressUpdateRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.body) return badRequest(res, 'ERR.PARAM.UNDEFINED', 'The request body is undefined.');
    if (!req.body.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    if (!req.body.episode) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'episode' paramater is undefined.");
    if (!req.body.progress) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'progress' paramater is undefined.");
    next();
};
