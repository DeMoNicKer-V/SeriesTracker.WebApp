export interface AnimeReqruest {
    title: string;
    description: string;
    episodes: number;
    score: number;
}

export const getGenres = async () => {
    const response = await fetch(`http://localhost:5125/shikimori/`);
    const genres: Genre = await response.json();
    return genres;
};

export const getAnimes = async (page: number) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/page/${page}`
    );
    const animes: Anime = await response.json();
    return animes;
};

export const getAnimeById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/shikimori/id/${id}`);
    const animes: Anime = await response.json();
    return animes;
};
