import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import authorization from '@/middleware/authorization';

// Route Imports:
import watch, { validation as watchVal } from '@/routes/watch';
import search, { validation as searchVal } from '@/routes/search';
import { info, recent, trending, infoVal } from '@/routes/info';
import profile, { validation as profileVal } from '@/routes/profile';
import { check, login, register, checkVal, loginVal, registerVal } from '@/routes/auth';
import { user, bioUpdate, userUpdate, configUpdate, designUpdate, bioUpdateVal, userUpdateVal, configUpdateVal, designUpdateVal } from '@/routes/user';

export default async (route: FastifyInstance, opts: FastifyPluginOptions) => {
    route.post('/auth/login', { preValidation: loginVal }, (req, res) => login(route, req, res));
    route.post('/auth/check', { preValidation: checkVal }, (req, res) => check(route, req, res));
    route.post('/auth/register', { preValidation: registerVal }, (req, res) => register(route, req, res));

    route.get('/user', { preHandler: authorization },  (req, res) => user(route, req, res));
    route.post('/user', { preHandler: authorization, preValidation: userUpdateVal }, (req, res) => userUpdate(route, req, res));
    route.get('/user/profile/:user', { preValidation: profileVal }, (req, res) => profile(route, req, res));
    route.post('/user/profile/bio', { preHandler: authorization, preValidation: bioUpdateVal }, (req, res) => bioUpdate(route, req, res));
    route.post('/user/profile/config', { preHandler: authorization, preValidation: configUpdateVal }, (req, res) => configUpdate(route, req, res));
    route.post('/user/profile/design', { preHandler: authorization, preValidation: designUpdateVal }, (req, res) => designUpdate(route, req, res));

    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/info/trending', (req, res) => trending(route, req, res));
    route.get('/info/:id', { preValidation: infoVal }, (req, res) => info(route, req, res));
    //route.get('/info/:id/episodes', { preValidation: infoVal }, (req, res) => episodes(route, req, res));

    route.get('/search', { preValidation: searchVal }, (req, res) => search(route, req, res));
    route.get('/watch/:id', { preValidation: watchVal }, (req, res) => watch(route, req, res));
};
