import badRequest from '@/res/badRequest';
import notFound from '@/res/notFound';
import success from '@/res/success';
import { FastifyRequest, FastifyInstance, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { ANIME } from '@consumet/extensions';
import serverError from '@/res/serverError';
import Progress from '@/models/Progress';
import getUser from '@/utilities/getUser';

const gogo = new ANIME.Gogoanime();
export type WatchRequest = FastifyRequest<{ Params: { ep: string; anime: number } }>;
export default async (app: FastifyInstance, req: WatchRequest, res: FastifyReply) => {
    if (!gogo.isWorking) return serverError(res, 'ERR.PROVIDER_DOWN', 'The gogo anime provider is currently not available.');
    const id = req.params.ep;
    let src: string = '';
    const user = await getUser(req);
    // prettier-ignore
    await gogo.fetchEpisodeSources(id).then(async (sources) => {
        if (!sources.sources[0]) getBackup(res, id); else {
            for (const source of sources.sources) {
                if (source.url.includes('vipanicdn.net')) {} else {
                    switch (source.quality) {
                        case 'default':
                            src = source.url;
                            break;

                        case 'backup':
                            src = source.url;
                            break;
                    }
                }
            }
        }
        const progress = await Progress.findOne({ user: user._id, anime: req.params.anime, episode: parseInt(req.params.ep.split('-').pop()!) });
        return success(res, { url: src, progress: progress && progress.progress });
    }).catch(() => notFound(res, 'ERR.EPISODE.NOTFOUND', 'The specified episode was not found.'));
};

export const validation = (req: WatchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.ep) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'ep' paramater is undefined.");
    if (!req.params.anime) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'anime' paramater is undefined.");
    next();
};

async function getBackup(res: FastifyReply, id: string): Promise<void> {
    const servers = await gogo.fetchEpisodeServers(id);
    return success(res, { embedded: servers[0].url });
};
