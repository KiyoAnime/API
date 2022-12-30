import serverError from "@/res/serverError";
import success from "@/res/success";
import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface Trending {
    id: number;
    title: string;
    banner: string;
    episodes: number;
    duration: number;
    released: number;
    description: string;
}

const index = async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const trending: Trending[] = [];
    await axios.get('https://apiconsumetorg-production.up.railway.app/meta/anilist/trending').then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        for (const result of response.data.results) trending.push({
            id: parseInt(result.id),
            title: result.title.userPreferred,
            banner: result.cover,
            duration: result.duration,
            released: result.releaseDate,
            episodes: result.totalEpisodes,
            description: result.description
        });
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, trending);
};

export default index;
