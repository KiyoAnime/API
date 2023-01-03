import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import search from '@/routes/search';
import recent from '@/routes/info/recent';
import trending from '@/routes/info/trending';
import info from '@/routes/info/index';
import episodes, { EpisodesRequest } from '@/routes/info/episodes';
import infoValidation from '@/validation/info';
import watch from '@/routes/watch';
import searchValidation from '@/validation/search';
import watchValidation from '@/validation/watch';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/info/trending', (req, res) => trending(route, req, res));
    route.get('/info/:id', { preValidation: infoValidation }, (req, res) => info(route, req, res));
    route.get('/info/:id/episodes', { preValidation: infoValidation }, (req, res) => episodes(route, req, res));

    route.get('/watch/:id', { preValidation: watchValidation }, (req, res) => watch(route, req as EpisodesRequest, res));

    route.get('/search', { preValidation: searchValidation }, (req, res) => search(route, req, res));
};
