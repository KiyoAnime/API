import { FastifyInstance, FastifyPluginOptions } from "fastify";

import recent from './routes/info/recent';
import type { SearchRequest } from './routes/search';
import search from './routes/search';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/search', (req, res) => search(route, req as SearchRequest, res));
};
