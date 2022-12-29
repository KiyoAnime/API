import { FastifyInstance, FastifyPluginOptions } from "fastify";
import search, { SearchRequest } from '@/routes/search';
import recent from '@/routes/info/recent';
import trending from '@/routes/info/trending';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/info/trending', (req, res) => trending(route, req, res));
    
    route.get('/search', (req, res) => search(route, req as SearchRequest, res));
};
