import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import serverError from '@/res/serverError';
import success from '@/res/success';
import { ITitle, META } from '@consumet/extensions';

interface Results {
    id: number;
    title: string;
    thumbnail: string;
}

const al = new META.Anilist();
export type SearchRequest = FastifyRequest<{ Querystring: { query?: string; genres?: string;  } }>;
export default async (app: FastifyInstance, req: SearchRequest, res: FastifyReply) => {
    await al.advancedSearch(req.query.query, undefined, undefined, 105, undefined, undefined, req.query.genres ? JSON.parse(req.query.genres) : undefined).then((sR) => {
        const results: Results[] = [];
        for (const result of sR.results) results.push({
            id: parseInt(result.id),
            title: (result.title as ITitle).userPreferred!,
            thumbnail: result.image!
        });
        return success(res, results);
    }).catch(() => serverError(res, 'ERR.REQUEST_FAILED', 'The request to the AniList API failed.'));
};

export const validation =  (req: SearchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    next();
};
