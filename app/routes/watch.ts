import success from '@/res/success';
import axios from 'axios';
import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';

interface Source {
    url: string;
    embedded: string;
}

interface Quality {
    url: string;
    quality: number;
}

export type WatchRequest = FastifyRequest<{ Params: { id: string } }>;
const index = async (app: FastifyInstance, req: WatchRequest, res: FastifyReply) => {
    const id = req.params.id;
    let source: Source|undefined = undefined;
    let qualities: Quality[] = [];
    let def: string|undefined = undefined;
    let backup: string|undefined = undefined;
    await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${id}`).then(async (response) => {
        if (!response.data.sources) {
            await axios.get(`https://api.consumet.org/anime/gogoanime/servers/${id}`).then((sRes) => {
                source = { url: '', embedded: sRes.data[0].url };
            });
        } else {
            const rawSources = response.data.sources;
            for await (const src of rawSources) {
                if (src.url.includes('vipanicdn.net')) { console.log('2') } else {
                    switch (src.quality) {
                        case 'default':
                            def = src.url;
                            break;

                        case 'backup':
                            backup = src.url;
                            break;

                        default:
                            console.log(parseInt(src.quality.replace('p', '')));
                            await qualities.push({ url: src.url, quality: parseInt(src.quality.replace('p', '')) });
                            break;
                    }
                }
            };
            console.log('d');
            if (!qualities[0]) {
                if (def) source = { url: def, embedded: response.data.headers.Referer }; else if (backup) source = { url: backup, embedded: response.data.headers.Referer };
            } else {
                const best = await qualities.map((q) => q.quality).sort((q1, q2) => q1 - q2)[qualities.length-1];
                if (best !== 1080 && best !== 720) {
                    if (def) source = { url: def, embedded: response.data.headers.Referer }; else if (backup) source = { url: backup, embedded: response.data.headers.Referer };
                } else {
                    source = { url: qualities.filter((q) => q.quality === best)[0].url, embedded: response.data.headers.Referer };
                };
            }
        }
    }).catch(async (err) => {
        await axios.get(`https://api.consumet.org/anime/gogoanime/servers/${id}`).then((sRes) => {
            source = { url: '', embedded: sRes.data[0].url };
        });
    });
    return success(res, source);
};

export default index;
