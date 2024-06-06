export interface AnimeReqruest {
    title: string;
    description: string;
    episodes: number;
    score: number;
}

export interface ShikimoriRequest {
    page: number;
    name: string;
    season: string;
    status: string;
    kind: string;
    genre: string;
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

export const getAnimesByParams = async (request: ShikimoriRequest) => {
    const response = await fetch(`http://localhost:5125/shikimori/animes/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
    });
    const animes: Anime = await response.json();
    return animes;
};

export const getAnimeById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/shikimori/id/${id}`);
    const animes: Anime = await response.json();
    return animes;
};
