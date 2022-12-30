import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import serverError from "@/res/serverError";
import success from '@/res/success';

interface Results {
    id: number;
    title:  string;
    image: string;
    description: string;
    rating: string;
    episodes: number;
    type: string;
    release: string;
}

export type SearchRequest = FastifyRequest<{
    Querystring: { query: string }
}>

const index = async (app: FastifyInstance, req: SearchRequest, res: FastifyReply) => {
    const query = req.query.query;
    const results: Results[] = [];
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/${query}`).then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        const animes = response.data.results;
        for (const anime of animes) {
            results.push({ id: parseInt(anime.id), title: anime.title.userPreferred,  image: anime.image, description: anime.description, rating: anime.rating, episodes: anime.totalEpisodes, type: anime.type, release: anime.releaseDate });
        };
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, results);
};

export default index;
