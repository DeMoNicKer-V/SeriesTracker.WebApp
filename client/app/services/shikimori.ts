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
    order: string;
    censored: boolean;
}

export interface AnimeInfo {
    series: SeriesInfo;
    anime: Anime;
}

export interface CalendarItem {
    next_episode: number;
    next_episode_at: string;
    duration: number;
    anime: CalendarAnime;
}

export interface AnimeImage {
    original: string;
    preview: string;
}
export interface CalendarAnime {
    id: number;
    name: string;
    russian: string;
    image: AnimeImage;
    url: string;
    kind: string;
    score: string;
    status: string;
    episodes: number;
    episodes_aired: number;
    aired_on: string;
    released_on: string;
}
export const getGenres = async () => {
    const response = await fetch(`http://localhost:5125/shikimori/groupGenres`);
    const genres: Genre = await response.json();
    return genres;
};

export const aaa = async () => {
    const response = await fetch(`https://shikimori.one/api/calendar/`);
    const genres: CalendarItem[] = await response.json();
    return genres;
};

export const getAnimes = async (page: number, order: string) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/page/${page}/order/${order}`
    );
    const animes: SeriesAnime = await response.json();
    return animes;
};

export const getAnimesByParams = async (request: ShikimoriRequest) => {
    const response = await fetch(`http://localhost:5125/shikimori/animes/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    });
    const animes: SeriesAnime = await response.json();
    return animes;
};

export const getAnimeById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/shikimori/id/${id}`);
    const animes: AnimeInfo = await response.json();
    return animes;
};

export const getAnimesByName = async (query: any) => {
    if (query === "") {
        return;
    }
    const response = await fetch(`http://localhost:5125/shikimori/${query}`);

    const animes: SeriesAnime[] = await response.json();
    return animes;
};

export const getAnimesByUserId = async (userId: string) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/user/${userId}`
    );

    const animes: SeriesAnime[] = await response.json();
    return animes;
};

export const getRandomAnime = async () => {
    const response = await fetch(`http://localhost:5125/shikimori/random/`);
    const id: string = await response.json();
    return id;
};

export const getRelatedAnimes = async (id: string) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/related/${id}`
    );
    const anime: Anime = await response.json();
    return anime;
};
