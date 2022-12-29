import { FastifyInstance, FastifyPluginOptions } from "fastify";

import recent from './routes/info/recent';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.get('/info/recent', (req, res) => recent(route, req, res));
};
