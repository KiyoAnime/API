import Anime from '@/interfaces/Anime';
import Progress from '@/models/Progress';
import User from '@/models/User';
import badRequest from '@/res/badRequest';
import serverError from '@/res/serverError';
import success from '@/res/success';
import getUser from '@/utilities/getUser';
import { ITitle, META } from '@consumet/extensions';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

const al = new META.Anilist();
export type InfoRequest = FastifyRequest<{ Params: { id: string }; Querystring: { episodes: string; progress?: string } }>;
export default (app: FastifyInstance, req: InfoRequest, res: FastifyReply) => {
    // prettier-ignore
    al.fetchAnimeInfo(req.params.id).then(async (info) => {
        let anime: Anime | undefined = undefined;
        anime = {
            id: parseInt(info.id),
            title: (info.title as ITitle).romaji!,
            description: info.description!,
            thumbnail: info.image!,
            banner: info.cover!,
            sub: info.hasSub!,
            dub: info.hasDub!,
            released: parseInt(info.releaseDate!),
            episodeCount: info.totalEpisodes!,
            adult: info.isAdult!,
            rating: info.rating!,
            type: info.type!,
            end: info.endDate?.day && info.endDate.month && info.endDate.year ? { day: info.endDate.day, month: info.endDate.month, year: info.endDate.year } : undefined,
            start: { day: info.startDate?.day!, month: info.startDate?.month!, year: info.startDate?.year! },
            genres: info.genres!,
            mal: parseInt(info.malId as string),
            titles: { ...info.title as ITitle },
            episodes: req.query.episodes === 'true' ? info.episodes! : undefined
        };
        if (req.query.progress && req.headers.authorization) {
            const user = await getUser(req);
            const progress = await Progress.findOne({ user: user._id, anime: info.id });
            anime.progress = progress ? progress.episode : undefined;
        }
        return success(res, anime);
    }).catch((err) => serverError(res, 'ERR.REQUEST_FAILED', `The request to the AniList API failed. Meta: ${err}`));
};

export const validation = (req: InfoRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    if (!req.query.episodes) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'episodes' query paramater is undefined.");
    next();
};
