import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';

interface Episode {
    url: string | undefined;
    quality: string;
}

export type EpisodesRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: EpisodesRequest, res: FastifyReply) => {
    const data: Episode[] = [];
    const id = req.params.id;
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/watch/${id}`).then((response) => {
        const qualities = response.data.sources;
        for (const quality of qualities) data.push({ url: quality.url, quality: quality.quality });
    });
    return success(res, data);
};

export default index;
