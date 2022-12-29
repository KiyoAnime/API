import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import serverError from "../res/serverError";
import success from '@/res/success';

interface Results {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    releaseDate: string;
    suborDub: string;
}

export type SearchRequest = FastifyRequest<{
    Querystring: { query: string }
}>

const index = async (app: FastifyInstance, req: SearchRequest, res: FastifyReply) => {
    const query = req.query.query;
    const results: Results[] = [];
    await axios.get(`https://api.consumet.org/anime/gogoanime/${query}`).then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        const animes = response.data.results;
        for (const anime of animes) {
            results.push({ id: anime.id, title: anime.title, url: anime.url, thumbnail: anime.image, releaseDate: anime.releaseDate, suborDub: anime.suborDub });
        };
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, results);
};

export default index;