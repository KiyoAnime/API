import axios from 'axios';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import serverError from '@/res/serverError';
import success from '@/res/success';

interface Series {
    id: number;
    title: string;
    thumbnail: string;
}

const index = async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const recent: Series[] = [];
    // prettier-ignore
    await axios.get('https://apiconsumetorg-production.up.railway.app/meta/anilist/recent-episodes?page=1&perPage=30').then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        for (const result of response.data.results) recent.push({ id: parseInt(result.id), title: result.title.userPreferred, thumbnail: result.image });
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    const filteredRecent = [...new Map(recent.map((item) => [item['id'], item])).values()];
    const completeRecent = filteredRecent.slice(0, 21);
    return success(res, completeRecent);
};

export default index;
