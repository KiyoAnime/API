import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import serverError from "@/res/serverError";
import success from '@/res/success';

interface Series {
    id: number;
    title: string;
    thumbnail: string;
}

const index = async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const recent: Series[] = [];
    await axios.get('https://api.consumet.org/meta/anilist/recent-episodes?perPage=30').then(async (response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        for (const result of response.data.results) {
            const resultObj = { id: parseInt(result.id), title: result.title.userPreferred, thumbnail: result.image };
            if (recent.some((s) => s.id === parseInt(result.id))) return;
            if (recent.length >= 21) return;
            recent.push(resultObj);
        };
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, recent);
};

export default index;
