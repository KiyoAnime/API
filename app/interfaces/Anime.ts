export interface Episode {
    id: string;
    number: number;
}

export interface Order {
    id: number;
    title: string;
    index: number;
    rating?: number;
    released: number;
    thumbnail: string;
}

export default interface Anime {
    id: number;
    mal: number;
    sub: boolean;
    dub: boolean;
    type: string;
    title: string;
    adult: boolean;
    banner: string;
    rating?: number;
    genres: string[];
    released: number;
    thumbnail: string;
    description: string;
    episodes?: Episode[];
    episodeCount: number;
    end?: { day: number; month: number; year: number; };
    start: { day: number; month: number; year: number; };
    titles: { english?: string; romaji?: string; native?: string; };
}
