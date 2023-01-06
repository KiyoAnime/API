import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';

export type WatchRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: WatchRequest, res: FastifyReply) => {
    const id = req.params.id;
    await axios.get(`https://api.enime.moe/episode/${id}`).then(async (response) => {
        const rawSources = response.data.sources;
        const sources: string[] = [];
        for (const source of rawSources) {
            await axios.get(`https://api.enime.moe/source/${source.id}`).then(async (sRes) => {
                await axios.get(sRes.data.url).then((cRes) => {
                    console.log(cRes.status);
                    if (cRes.status === 200) sources.push(sRes.data.url);
                }).catch((cErr) => {
                    if (cErr.response.status !== 200) return console.log(cErr.response);
                });
            });
        }
        return success(res, sources[0]);
    });
};

export default index;
