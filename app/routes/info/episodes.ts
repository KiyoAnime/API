import success from "@/res/success";
import axios from "axios";
import { FastifyRequest, FastifyInstance, FastifyReply } from "fastify";

interface Episode {
    totalepisodes: number;
    episodeData: EpisodeData[];
}

interface EpisodeData {
    epno: number;
    epid: string;
}

export type EpisodesRequest = FastifyRequest<{ Params: { id: string; } }>;

const index = async (app: FastifyInstance, req: EpisodesRequest, res: FastifyReply) => {
    const episodes: Episode[] = [];
    const id = req.params.id;
    await axios.get(`https://apiconsumetorg-production.up.railway.app/meta/anilist/info/${id}`).then((response) => {
        const episodesData = response.data.episodes;
        const totalEpisodes: number = response.data.episodes.length;
        const episodeData: EpisodeData[] = [];
        for (const episode of episodesData) {
            episodeData.push({
                epno: parseInt(episode.id.split('-').pop()!),
                epid: episode.id
            });
        }
        episodes.push({
            totalepisodes: totalEpisodes,
            episodeData: episodeData
        });
    });
    return success(res, episodes);
};

export default index;