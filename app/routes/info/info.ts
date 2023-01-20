import badRequest from '@/res/badRequest';
import serverError from '@/res/serverError';
import success from '@/res/success';
import axios from 'axios';
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
    type: string;
    title: string;
    color: string;
    adult: boolean;
    banner: string;
    genres: string[];
    released: number;
    duration: number;
    subOrDub: string;
    thumbnail: string;
    popularity: number;
    description: string;
    episodeCount: number;
    episodes: Episode[]|undefined;
    watchOrder: WatchOrder[]|undefined;
    end: { month: number; year: number; day: number; };
    start: { month: number; year: number; day: number; };
}

export type InfoRequest = FastifyRequest<{ Params: { id: string }; Querystring: { episodes: boolean } }>;
const index = async (app: FastifyInstance, req: InfoRequest, res: FastifyReply) => {
    let info: Anime | undefined;
    const id = req.params.id;
    // prettier-ignore
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/info/${id}`).then(async (response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        const data = response.data;
        const watchOrder: WatchOrder[] = [];
        await axios.get(`https://chiaki.vercel.app/get?group_id=${data.mappings.mal}`).then(async(wores) => {
            if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Chiaki API failed. R=1'); // REASON 2
            const data = wores.data;
            for (const anime of data) {
                watchOrder.push({
                    index: anime.index,
                    name: anime.name,
                    id: anime.url.split('/').pop(),
                    info: anime.info,
                    url: anime.url,
                });
            }
        })
        info = {
            id: parseInt(data.id),
            title: data.title.romaji,
            color: data.color,
            description: data.description,
            subOrDub: data.subOrDub,
            banner: data.cover,
            thumbnail: data.image,
            released: data.releaseDate,
            episodeCount: data.totalEpisodes,
            duration: data.duration,
            adult: data.isAdult,
            popularity: data.popularity,
            type: data.type,
            start: data.startDate,
            end: data.endDate,
            mal: data.malId,
            genres: data.genres,
            episodes: [],
            watchOrder,
        };
        if (req.query.episodes) {
            for (const episode of data.episodes) {
                if (req.query.episodes = false) info.episodes = [];
                if (info.episodes === undefined) info.episodes = [];
                info.episodes.push({
                    id: episode.id,
                    number: episode.number,
                });
            }
        }
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 3
    });
    return success(res, info);
};

export const validation =  (req: InfoRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    if (!req.query.episodes) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'episodes' query paramater is undefined.");
    next();
};

export default index;
