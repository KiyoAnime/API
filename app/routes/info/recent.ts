import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import serverError from '@/res/serverError';
import success from '@/res/success';
import { ITitle, META } from '@consumet/extensions';

interface Series {
    id: number;
    title: string;
    thumbnail: string;
}

const al = new META.Anilist();
export default async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const recent: Series[] = [];
    // prettier-ignore
    await al.fetchRecentEpisodes('gogoanime', 1, 65).then(async (rE) => {
        for (const ep of rE.results) {
            recent.push({
                id: parseInt(ep.id),
                title: (ep.title as ITitle).userPreferred!,
                thumbnail: ep.image!
            });
        }
        const filteredRecent = [...new Map(recent.map((item) => [item['id'], item])).values()].slice(0, 28);
        return success(res, filteredRecent);
    }).catch(() => serverError(res, 'ERR.REQUEST_FAILED', 'The request to the AniList API failed.'));
};
