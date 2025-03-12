import { Anime } from "../Models/Anime/Anime";
import { CalendarAnimeItem } from "../Models/Anime/CalendarAnimeItem";
import { SeriesAnime } from "../Models/Anime/SeriesAnime";
import { Series } from "../Models/Series/Series";

export interface AnimeReqruest {
    title: string;
    description: string;
    episodes: number;
    score: number;
}

export interface AnimeInfo {
    series: Series;
    anime: Anime;
}

export interface LastActivityAnime {
    id: number;
    image: string;
    title: string;
    date: string;
}
export const getGenres = async () => {
    const response = await fetch(`http://localhost:5125/shikimori/groupGenres`);
    const genres: Genre = await response.json();
    return genres;
};

export const getAiredAnimes = async () => {
    const response = await fetch(`https://shikimori.one/api/calendar/`);
    const genres: CalendarAnimeItem[] = await response.json();
    return genres;
};

export const getAnimes = async (page: number, order: string) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/page/${page}/order/${order}`
    );
    const animes: SeriesAnime = await response.json();
    return animes;
};

export const getCalendarAnimes = async (url: string) => {
    const response = await fetch(url);
    const animes: CalendarAnimeItem[] = await response.json();
    return animes;
};

export const getAnimesByParams = async (fullUrl: string) => {
    const response = await fetch(`http://localhost:5125${fullUrl}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
    const animes: SeriesAnime[] = await response.json();
    return animes;
};

export const getAnimeById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/shikimori/id/${id}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
    const animes: Anime = await response.json();
    return animes;
};

export const getAnimesById = async (username: string, id: string) => {
    const response = await fetch(
        `http://localhost:5125/shikimori/activity?username=${username}&id=${id}`,
        {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
        }
    );
    const animes: SeriesAnime[] = await response.json();
    return animes;
};

export const getAnimesByName = async (query: any) => {
    const response = await fetch(`http://localhost:5125/shikimori/${query}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
    });
    const animes: SeriesAnime[] = await response.json();
    return animes;
};

export const getAnimesByUsername = async (url: string) => {
    const response = await fetch(`http://localhost:5125/shikimori${url}`);
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
