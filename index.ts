import config from 'config';
import fastify from 'fastify';
import router from './router';
import fastifyCors from '@fastify/cors';

const dev = process.argv.includes('--dev');
dev && console.clear();

const app = fastify({ logger: dev });
app.register(require('fastify-qs'), {})
app.register(router);
app.register(fastifyCors, { origin: true });

app.listen({ port: config.get('port'), host: config.get('bind') });
