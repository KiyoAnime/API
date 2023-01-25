import badRequest from '@/res/badRequest';
import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply, HookHandlerDoneFunction } from 'fastify';

interface Source {
    url: string;
    embedded: string;
}

export type WatchRequest = FastifyRequest<{ Params: { id: string } }>;
export default async (app: FastifyInstance, req: WatchRequest, res: FastifyReply) => {
    const id = req.params.id;
    let def: string|undefined = undefined;
    let source: Source|undefined = undefined;
    let backup: string|undefined = undefined;
    await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${id}`).then(async (response) => {
        if (!response.data.sources) {
            await axios.get(`https://api.consumet.org/anime/gogoanime/servers/${id}`).then((sRes) => {
                source = { url: '', embedded: sRes.data[0].url };
            });
        } else {
            const rawSources = response.data.sources;
            for await (const src of rawSources) {
                if (src.url.includes('vipanicdn.net')) {} else {
                    switch (src.quality) {
                        case 'default':
                            def = src.url;
                            break;

                        case 'backup':
                            backup = src.url;
                            break;
                    }
                }
            };
            console.log('d');
            if (backup) {
                source = { url: backup, embedded: response.data.headers.Referer };
            } else if (def) {
                source = { url: def, embedded: response.data.headers.Referer };
            };
        }
    }).catch(async () => {
        await axios.get(`https://api.consumet.org/anime/gogoanime/servers/${id}`).then((sRes) => {
            source = { url: '', embedded: sRes.data[0].url };
        });
    });
    return success(res, source);
};

export const validation =  (req: WatchRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    next();
};
