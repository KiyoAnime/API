import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';

interface Episode {
    id: string;
    number: number;
};

export type EpisodesRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: EpisodesRequest, res: FastifyReply) => {
    const episodes: Episode[] = [];
    const id = req.params.id;
    let total = 0;
    await axios.get(`https://api.enime.moe/mapping/anilist/${id}`).then((response) => {
        const episodesData = response.data.episodes;
        total = response.data.episodes.length;
        for (const episode of episodesData) episodes.push({ id: episode.id, number: episode.number });
    });
    return success(res, { total: total, episodes: episodes });
};

export default index;
