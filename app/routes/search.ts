import axios from 'axios';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import serverError from '@/res/serverError';
import success from '@/res/success';
import badRequest from '@/res/badRequest';

interface Results {
    id: number;
    type: string;
    title: string;
    episodes: number;
    released: string;
    thumbnail: string;
}

export type SearchRequest = FastifyRequest<{ Querystring: { query?: string; genres?: string;  } }>;
export default async (app: FastifyInstance, req: SearchRequest, res: FastifyReply) => {
    const params = new URLSearchParams();
    if (req.query.query) params.append('query', req.query.query);
    if (req.query.genres) params.append('genres', req.query.genres);
    params.append('perPage', '105');
    // prettier-ignore
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/advanced-search?${params}`).then(async (response) => {
        const results: Results[] = [];
        const animes = response.data.results;
        console.log(animes);
        for (const anime of animes) await results.push({
            id: parseInt(anime.id),
            title: anime.title.userPreferred,
            thumbnail: anime.image,
            episodes: anime.totalEpisodes,
            type: anime.type,
            released: anime.releaseDate
        });
        return success(res, results);
    }).catch((err) => {
        return serverError(res, 'ERR.REQUEST_FAILED', `The request to the Consumet API failed. R=1. Error: ${err.response.data}`); // REASON 1
    });
};

export const validation =  (req: SearchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    // if (!req.query.query) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'query' query paramater is undefined.");
    next();
};
