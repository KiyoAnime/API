
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type UserSyncRequest = FastifyRequest<{ Querystring: { id: string; status: string; progress: string; aniauth: string; } }>;
export default async (app: FastifyInstance, req: UserSyncRequest, res: FastifyReply) => {
    const { id, status, progress, aniauth } = req.query;
    let query = `
      mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
        SaveMediaListEntry (mediaId: $mediaId, status: $status, progress: $progress) {
          id
          status
          progress
        }
      }
    `;
    const variables = {
      mediaId: parseInt(id),
      status: status,
      progress: parseInt(progress),
    };
    const headers: any = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    headers.Authorization = `Bearer ${aniauth}`;
    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    });
    const json = await response.json();
    if (json.errors) return badRequest(res, "ERR.ANILIST.ERROR", "AniList returned an error");
    return success(res, json.data);
};

export const validation = (req: UserSyncRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    const { id, status, progress, aniauth } = req.query;
    if (!id || !status || !progress || !aniauth) return badRequest(res, "ERR.QUERY.UNDEFINED", "Missing parameters");
    next();
};
