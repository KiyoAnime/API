import Trending from '@/interfaces/Trending';
import serverError from '@/res/serverError';
import success from '@/res/success';
import { FastifyReply, FastifyRequest } from 'fastify';

export default async (app: Instance, req: FastifyRequest, res: FastifyReply) => {
    const data = await app.redis.get('trending');
    if (!data) return serverError(res, 'ERR.CACHE.NULL', 'The required data was not found in the cache. Please try again in a few moments.');
    const trending: Trending[] = JSON.parse(data);
    return success(res, trending);
};
