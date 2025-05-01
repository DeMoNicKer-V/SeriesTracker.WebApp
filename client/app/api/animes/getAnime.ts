import { SeriesAnime } from "@/app/models/anime/SeriesAnime";
import {
    GET_ANIME_BY_ID_URL,
    GET_ANIMES_BY_NAME_URL,
    GET_ANIMES_URL,
    GET_RANDOM_ANIME_URL,
    GET_USER_RECENT_ANIMES_URL,
} from "../endpoints";
import { get } from "../httpClient";
import { Anime } from "@/app/models/anime/Anime";

export const getAnimes = async (
    paramString: string
): Promise<SeriesAnime[]> => {
    const url = GET_ANIMES_URL.replace("{query}", paramString);
    const animes = await get<SeriesAnime[]>(url, {});
    return animes;
};

export const getAnimeById = async (id: string): Promise<Anime> => {
    const url = GET_ANIME_BY_ID_URL.replace("{id}", id);
    const anime = await get<Anime>(url, {});
    return anime;
};

export const GetRecentUserActivities = async (
    userName: string,
    id: string
): Promise<SeriesAnime[]> => {
    const url = GET_USER_RECENT_ANIMES_URL.replace(
        "{userName}",
        userName
    ).replace("{id}", id);
    const recentAnimes = await get<SeriesAnime[]>(url, {});
    return recentAnimes;
};

export const getAnimesByName = async (name: any): Promise<SeriesAnime[]> => {
    const url = GET_ANIMES_BY_NAME_URL.replace("{name}", name);
    const animes = await get<SeriesAnime[]>(url, {});
    return animes;
};

export const getRandomAnimeId = async (): Promise<string> => {
    const animeId = await get<string>(GET_RANDOM_ANIME_URL, {});
    return animeId;
};
