import config from 'config';
import fastify, { FastifyInstance, HookHandlerDoneFunction as HHDF } from 'fastify';
import router from './router';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import db from '@/helpers/db';
import { Redis } from 'ioredis';
import cache from '@/helpers/cache';

if (!process.env.APP_SECRET || !process.env.APP_COOKIE_SECRET || !process.env.REDIS_URL) {
    console.error('Please specify an APP_SECRET an APP_COOKIE_SECRET and a REDIS_URL environment variable.');
    process.exit(0);
}

const dev = process.argv.includes('--dev');
dev && console.clear();

declare global {
    type Instance = FastifyInstance & { redis: Redis };
}

const app: Instance = Object.assign(fastify({ logger: dev }), { redis: new Redis(process.env.REDIS_URL!) });
router(app, {});
app.register(fastifyCors, { origin: true });
app.register(fastifyCookie, { secret: process.env.APP_COOKIE_SECRET! });
db();

cache(app);

app.listen({ port: config.get('port'), host: config.get('bind') });
