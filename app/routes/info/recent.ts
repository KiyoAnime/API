import { FastifyReply, FastifyRequest } from 'fastify';
import serverError from '@/res/serverError';
import success from '@/res/success';
import Recent from '@/interfaces/Recent';

export default async (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    const data = await app.redis.get('recent');
    if (!data) return serverError(res, 'ERR.CACHE.NULL', 'The required data was not found in the cache. Please try again in a few moments.');
    const recent: Recent[] = JSON.parse(data);
    return success(res, recent);
};
