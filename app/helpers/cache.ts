import Recent from "@/interfaces/Recent";
import Trending from "@/interfaces/Trending";
import { ITitle, META } from "@consumet/extensions";

const al = new META.Anilist();

export default async (app: Instance) => {
    console.time('cache');
    console.log('Beginning process of caching data. Please wait...');
    await setRecent(app);
    await setTrending(app);
    console.log('All required data has been successfully cached. Operation took: ');
    console.timeEnd('cache');
};

async function setRecent(app: Instance): Promise<void> {
    const recent: Recent[] = [];
    await al.fetchRecentEpisodes('gogoanime', 1, 65).then(async (res) => {
        for (const ep of res.results) {
            const anime = await al.fetchAnilistInfoById(ep.id);
            if (anime.countryOfOrigin !== 'JP') {} else {
                recent.push({
                    id: parseInt(anime.id),
                    title: (anime.title as ITitle).romaji!,
                    thumbnail: anime.image!
                });
            };
        }
    });
    const filteredRecent = [...new Map(recent.map((item) => [item['id'], item])).values()].slice(0, 28);
    app.redis.set('recent', JSON.stringify(filteredRecent));
};

async function setTrending(app: Instance): Promise<void> {
    const trending: Trending[] = [];
    await al.fetchTrendingAnime(1, 10).then(async (res) => {
        for (const result of res.results) {
            const anime = await al.fetchAnilistInfoById(result.id);
            trending.push({
                id: parseInt(anime.id),
                title: (anime.title as ITitle).romaji!,
                banner: anime.image!,
                episodes: anime.totalEpisodes!,
                released: parseInt(anime.releaseDate!),
                description: anime.description!
            });
        }
    });
    app.redis.set('trending', JSON.stringify(trending));
};
