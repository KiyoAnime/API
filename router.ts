import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { infoVal, watchVal, searchVal, registerVal } from '@/validation';
import search from '@/routes/search';
import watch from '@/routes/watch';
import { info, recent, trending, episodes } from '@/routes/info';
import { register } from '@/routes/auth';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.post('/auth/login', { preValidation: registerVal }, (req, res) => register(route, req, res));

    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/info/trending', (req, res) => trending(route, req, res));
    route.get('/info/:id', { preValidation: infoVal }, (req, res) => info(route, req, res));
    route.get('/info/:id/episodes', { preValidation: infoVal }, (req, res) => episodes(route, req, res));

    route.get('/watch/:id', { preValidation: watchVal }, (req, res) => watch(route, req, res));

    route.get('/search', { preValidation: searchVal }, (req, res) => search(route, req, res));
};
