import config from 'config';
import fastify from 'fastify';
import router from './router';
import { XataClient } from './xata';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

if (!process.env.APP_SECRET || !process.env.APP_COOKIE_SECRET) {
    console.error('Please specify an APP_SECRET and an APP_COOKIE_SECRET environment variable.');
    process.exit(0);
};

const dev = process.argv.includes('--dev');
dev && console.clear();

const app = fastify({ logger: dev });
app.register(router);
app.register(fastifyCors, { origin: true });
app.register(fastifyCookie, { secret: process.env.APP_COOKIE_SECRET! });
new XataClient();

app.listen({ port: config.get('port'), host: config.get('bind') });
