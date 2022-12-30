import success from "@/res/success";
import axios from "axios";
import { FastifyRequest, FastifyInstance, FastifyReply } from "fastify";

interface EpisodeData {
    url: string | undefined;
    quality: string;
}

export type EpisodesRequest = FastifyRequest<{ Params: { id: string; } }>;

const index = async (app: FastifyInstance, req: EpisodesRequest, res: FastifyReply) => {
    const data: EpisodeData[] = [];
    const id = req.params.id;
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/watch/${id}`).then((response) => {
        const episodesData = response.data.sources;
        for (const episode of episodesData) {
            data.push({
                url: episode.url,
                quality: episode.quality
            });
        }
    });
    return success(res, data);
};

export default index;

// https://apiconsumetorg-production.up.railway.app/meta/anilist/watch/spy-x-family-episode-1
// https://apiconsumetorg-production.up.railway.app/meta/anilist/watch/140960