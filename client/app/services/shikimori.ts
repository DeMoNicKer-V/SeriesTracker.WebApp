export interface AnimeReqruest {
    title: string;
    description: string;
    episodes: number;
    score: number;
}

export const getAnimes = async (page: number) => {
    const response = await fetch(`http://localhost:5125/shikimori/${page}`);
    const animes: Anime = await response.json();
    return animes;
};
