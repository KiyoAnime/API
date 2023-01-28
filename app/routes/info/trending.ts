import serverError from '@/res/serverError';
import success from '@/res/success';
import { ITitle, META } from '@consumet/extensions';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface Trending {
    id: number;
    title: string;
    banner: string;
    episodes: number;
    released: number;
    description: string;
}

const al = new META.Anilist();
export default async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    // prettier-ignore
    await al.fetchTrendingAnime(1, 10).then(async (tA) => {
        const trending: Trending[] = [];
        for (const result of tA.results) {
            const series = await al.fetchAnimeInfo(result.id);
            trending.push({
                id: parseInt(result.id),
                title: (result.title as ITitle).userPreferred!,
                banner: result.cover!,
                released: parseInt(result.releaseDate!),
                episodes: series.totalEpisodes!,
                description: series.description!
            });
        }
        return success(res, trending);
    }).catch(() => serverError(res, 'ERR.REQUEST_FAILED', 'The request to the AniList API failed.'));
};
