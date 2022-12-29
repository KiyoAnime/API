import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import serverError from "../../res/serverError";
import success from '@/res/success';

interface Series {
    id: string;
    title: string;
    thumbnail: string;
}

const index = async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const recent: Series[] = [];
    await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes?page=1').then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        for (const result of response.data.results) {
            recent.push({ id: result.id, title: result.title, thumbnail: result.image });
        };
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes?page=2').then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=3'); // REASON 3
        const result = response.data.results[0];
        recent.push({ id: result.id, title: result.title, thumbnail: result.image });
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=4'); // REASON 4
    });
    return success(res, recent);
};

export default index;