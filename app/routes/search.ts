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

export type SearchRequest = FastifyRequest<{ Querystring: { query: string } }>;
export default async (app: FastifyInstance, req: SearchRequest, res: FastifyReply) => {
    const query = req.query.query;
    const results: Results[] = [];
    // prettier-ignore
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/${query}`).then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        const animes = response.data.results;
        for (const anime of animes) results.push({
            id: parseInt(anime.id),
            title: anime.title.userPreferred,
            thumbnail: anime.image,
            episodes: anime.totalEpisodes,
            type: anime.type,
            released: anime.releaseDate
        });
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, results);
};

export const validation =  (req: SearchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.query.query) return badRequest(res, 'ERR.QUERY.UNDEFINED', "The 'query' query paramater is undefined.");
    next();
};
