import { FastifyPluginOptions } from 'fastify';
import authorization from '@/middleware/authorization';

// Route Imports:
import watch, { validation as watchVal } from '@/routes/watch';
import search, { validation as searchVal } from '@/routes/search';
import profile, { validation as profileVal } from '@/routes/profile';
import { discord, discordCallback, discordVal } from '@/routes/user/integrations';
import { info, order, recent, trending, infoVal, orderVal } from '@/routes/info';
import { check, login, register, checkVal, loginVal, registerVal } from '@/routes/auth';
import {
    user,
    progress,
    bioUpdate,
    userUpdate,
    playerUpdate,
    configUpdate,
    designUpdate,
    progressVal,
    bioUpdateVal,
    userUpdateVal,
    playerUpdateVal,
    configUpdateVal,
    designUpdateVal
} from '@/routes/user';

export default async (route: Instance, opts: FastifyPluginOptions) => {
    route.post('/auth/login', { preValidation: loginVal }, (req, res) => login(route, req, res));
    route.post('/auth/check', { preValidation: checkVal }, (req, res) => check(route, req, res));
    route.post('/auth/register', { preValidation: registerVal }, (req, res) => register(route, req, res));

    route.get('/user', { preHandler: authorization }, (req, res) => user(route, req, res));
    route.post('/user', { preHandler: authorization, preValidation: userUpdateVal }, (req, res) => userUpdate(route, req, res));
    route.post('/user/player', { preHandler: authorization, preValidation: playerUpdateVal }, (req, res) => playerUpdate(route, req, res));

    route.get('/user/profile/:user', { preValidation: profileVal }, (req, res) => profile(route, req, res));
    route.post('/user/profile/bio', { preHandler: authorization, preValidation: bioUpdateVal }, (req, res) => bioUpdate(route, req, res));
    route.post('/user/profile/config', { preHandler: authorization, preValidation: configUpdateVal }, (req, res) => configUpdate(route, req, res));
    route.post('/user/profile/design', { preHandler: authorization, preValidation: designUpdateVal }, (req, res) => designUpdate(route, req, res));
    route.post('/user/progress', { preHandler: authorization, preValidation: progressVal }, (req, res) => progress(route, req, res));
    route.get('/user/integrations/discord', (req, res) => discord(route, req, res));
    route.post('/user/integrations/discord', { preValidation: discordVal }, (req, res) => discordCallback(route, req, res));

    route.get('/info/recent', (req, res) => recent(route, req, res));
    route.get('/info/trending', (req, res) => trending(route, req, res));
    route.get('/info/:id', { preValidation: infoVal }, (req, res) => info(route, req, res));
    route.get('/info/:id/order', { preValidation: orderVal }, (req, res) => order(route, req, res));

    route.get('/search', { preValidation: searchVal }, (req, res) => search(route, req, res));
    route.get('/watch/:anime/:ep', { preHandler: authorization, preValidation: watchVal }, (req, res) => watch(route, req, res));
};
