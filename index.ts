import config from 'config';
import fastify, { FastifyInstance } from 'fastify';
import router from './router';
import fastifyCors from '@fastify/cors';
import db from '@/helpers/db';
import { Redis } from 'ioredis';
import cache from '@/helpers/cache';
import environment from '@/helpers/environment';

environment();

declare global {
    type Instance = FastifyInstance & { redis: Redis };
}

const dev = process.argv.includes('--dev');
dev && console.clear();

const app: Instance = Object.assign(fastify({ logger: dev }), { redis: new Redis(process.env.REDIS_URL!) });
router(app, {});
app.register(fastifyCors, { origin: true });
db();

cache(app);

app.listen({ port: config.get('port'), host: config.get('bind') }).then(() => console.log('Kiyo API is now live.'));
