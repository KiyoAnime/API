import serverError from '@/res/serverError';
import success from '@/res/success';
import axios from 'axios';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface Episode {
    id: string;
    number: number;
}

interface Anime {
    id: number;
    mal: number;
    type: string;
    title: string;
    color: string;
    adult: boolean;
    banner: string;
    genres: string[];
    released: number;
    duration: number;
    subOrDub: string;
    thumbnail: string;
    popularity: number;
    description: string;
    episodeCount: number;
    episodes: Episode[] | undefined;
    end: { month: number; year: number; day: number; };
    start: { month: number; year: number; day: number; };
}

export type InfoRequest = FastifyRequest<{ Params: { id: string }; Querystring: { episodes: boolean } }>;
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
            episodeCount: data.totalEpisodes,
            duration: data.duration,
            adult: data.isAdult,
            popularity: data.popularity,
            type: data.type,
            start: data.startDate,
            end: data.endDate,
            mal: data.malId,
            genres: data.genres,
            episodes: [],
        };
        if (req.query.episodes) {
            for (const episode of data.episodes) {
                if (req.query.episodes === undefined) info.episodes = [];
                if (info.episodes === undefined) info.episodes = [];
                if (req.query.episodes === true) {
                    info.episodes.push({
                        id: episode.id,
                        number: episode.number,
                    });
                } else {
                    info.episodes = [];
                }
            }
        }
    }).catch(() => {
        return serverError(res, 'ERR.REQUEST_FAILED', 'The request to the Consumet API failed. R=2'); //REASON 2
    });
    return success(res, info);
};

export default index;
