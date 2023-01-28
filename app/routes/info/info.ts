import badRequest from '@/res/badRequest';
import serverError from '@/res/serverError';
import success from '@/res/success';
import { ITitle, META } from '@consumet/extensions';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

interface Episode {
    id: string;
    number: number;
}

interface WatchOrder {
    index: number;
    name: string;
    id: number;
    info: string;
    url: string;
}

interface Anime {
    id: number;
    mal: number;
    sub: boolean;
    dub: boolean;
    type: string;
    title: string;
    adult: boolean;
    banner: string;
    rating: number;
    genres: string[];
    released: number;
    thumbnail: string;
    description: string;
    episodeCount: number;
    episodes: Episode[]|undefined;
    watchOrder?: WatchOrder[]|undefined;
    end?: { day: number; month: number; year: number; };
    start: { day: number; month: number; year: number; };
}

const al = new META.Anilist();
export type InfoRequest = FastifyRequest<{ Params: { id: string }; Querystring: { order: string; episodes: string; } }>;
export default async (app: FastifyInstance, req: InfoRequest, res: FastifyReply) => {
    await al.fetchAnimeInfo(req.params.id).then((info) => {
        let anime: Anime|undefined = undefined;
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
            episodes: req.query.episodes === 'true' ? info.episodes! : undefined,
        };
        return success(res, anime);
    }).catch(() => serverError(res, 'ERR.REQUEST_FAILED', 'The request to the AniList API failed.'));
    // prettier-ignore
    //     await axios.get(`https://chiaki.vercel.app/get?group_id=${data.mappings.mal}`).then((response2) => {
    //         if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Chiaki API failed. R=1'); // REASON 2
    //         for (const anime of response2.data) {
    //             order.push({
    //                 index: anime.index,
    //                 name: anime.name,
    //                 id: anime.url.split('/').pop(),
    //                 info: anime.info,
    //                 url: anime.url,
    //             });
    //         }
    //     });
};

export const validation =  (req: InfoRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    if (!req.query.order) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'order' query paramater is undefined.");
    if (!req.query.episodes) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'episodes' query paramater is undefined.");
    next();
};
