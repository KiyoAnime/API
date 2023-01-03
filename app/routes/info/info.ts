import serverError from '@/res/serverError';
import success from '@/res/success';
import axios from 'axios';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface Anime {
    id: number;
    title: string;
    color: string;
    adult: boolean;
    banner: string;
    genres: string[];
    released: number;
    episodes: number;
    duration: number;
    subOrDub: string;
    thumbnail: string;
    popularity: string;
    description: string;
}

export type InfoRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: InfoRequest, res: FastifyReply) => {
    let info: Anime | undefined;
    const id = req.params.id;
    // prettier-ignore
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/info/${id}`).then((response) => {
        if (response.status !== 200) return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=1'); // REASON 1
        const data = response.data;
        info = {
            id: parseInt(data.id),
            title: data.title.romaji,
            color: data.color,
            description: data.description,
            subOrDub: data.subOrDub,
            banner: data.cover,
            thumbnail: data.image,
            released: data.releaseDate,
            episodes: data.totalEpisodes,
            duration: data.duration,
            adult: data.isAdult,
            popularity: data.popularity,
            genres: data.genres
        };
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, info);
};

export default index;
