import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';

export type WatchRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: WatchRequest, res: FastifyReply) => {
    const id = req.params.id;
    await axios.get(`https://api.enime.moe/source/${id}`).then((response) => {
        return success(res, response.data.url);
    });
    //return success(res, data);
};

export default index;
