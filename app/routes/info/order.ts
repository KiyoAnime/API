import { Order } from '@/interfaces/Anime';
import badRequest from '@/res/badRequest';
import serverError from '@/res/serverError';
import success from '@/res/success';
import malToAnilist from '@/utilities/malToAnilist';
import { ITitle, META } from '@consumet/extensions';
import axios from 'axios';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

const al = new META.Anilist();
export type OrderRequest = FastifyRequest<{ Params: { id: string } }>;
export default async (app: Instance, req: OrderRequest, res: FastifyReply) => {
    // prettier-ignore
    await al.fetchAnilistInfoById(req.params.id).then(async (info) => {
        let order: Order[] = [];
        const chiaki = await axios.get(`https://chiaki.vercel.app/get?group_id=${info.malId}`);
        for (const a of chiaki.data) {
            const alId = await malToAnilist(parseInt(a.url.split('/').pop())).catch(() => {});
            if (!alId) {} else {
                const info = await al.fetchAnilistInfoById(alId.toString()).catch(() => {});
                if (!info) {} else {
                    if (info.genres?.includes('Hentai') || info.type === 'MANGA') {} else {
                        order.push({
                            id: parseInt(info.id),
                            index: a.index,
                            title: (info.title as ITitle).romaji!,
                            rating: info.rating,
                            released: parseInt(info.releaseDate!),
                            thumbnail: info.image!
                        });
                    }
                }
            }
        }
        return success(res, order);
    }).catch((err) => serverError(res, 'ERR.REQUEST_FAILED', `The request to the Chiaki API failed. Meta: ${err}`));
};

export const validation = (req: OrderRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    if (!req.params.id) return badRequest(res, 'ERR.PARAM.UNDEFINED', "The 'id' paramater is undefined.");
    next();
};
