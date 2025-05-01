// api/anime/getAnime.ts

// Импортируем типы данных (модели)
import { Anime } from "@/app/models/anime/Anime"; //  Тип для отдельного аниме
import { SeriesAnime } from "@/app/models/anime/SeriesAnime"; //  Тип для аниме в списке

// Импортируем эндпоинты из файла endpoints.ts
import {
    GET_ANIME_BY_ID_URL, //  URL для получения аниме по ID
    GET_ANIMES_BY_NAME_URL, //  URL для получения аниме по имени
    GET_ANIMES_URL, //  URL для получения списка аниме
    GET_RANDOM_ANIME_URL, //  URL для получения случайного аниме
    GET_USER_RECENT_ANIMES_URL, //  URL для получения недавно просмотренных аниме пользователя
} from "../endpoints";

// Импортируем функцию get для выполнения HTTP-запросов
import { get } from "../httpClient";

// Функция для получения списка аниме по параметрам запроса (query)
export const getAnimes = async (
    paramString: string //  Строка с параметрами запроса (например, "?page=1&limit=10")
): Promise<SeriesAnime[]> => {
    const url = GET_ANIMES_URL.replace("{query}", paramString);
    const animes = await get<SeriesAnime[]>(url, {}); //  Ожидаем массив объектов SeriesAnime

    return animes;
};

// Функция для получения аниме по ID
export const getAnimeById = async (id: string): Promise<Anime> => {
    const url = GET_ANIME_BY_ID_URL.replace("{id}", id);
    const anime = await get<Anime>(url, {}); //  Ожидаем объект Anime

    return anime;
};

// Функция для получения недавно просмотренных аниме пользователя
export const GetRecentUserActivities = async (
    userName: string, //  Имя пользователя
    id: string //  Строка из id аниме (прим. "52991,2892...")
): Promise<SeriesAnime[]> => {
    const url = GET_USER_RECENT_ANIMES_URL.replace(
        "{userName}",
        userName
    ).replace("{id}", id);
    const recentAnimes = await get<SeriesAnime[]>(url, {}); //  Ожидаем массив объектов SeriesAnime

    return recentAnimes;
};

// Функция для получения аниме по названию
export const getAnimesByName = async (name: any): Promise<SeriesAnime[]> => {
    const url = GET_ANIMES_BY_NAME_URL.replace("{name}", name);
    const animes = await get<SeriesAnime[]>(url, {}); //  Ожидаем массив объектов SeriesAnime

    return animes;
};

// Функция для получения ID случайного аниме
export const getRandomAnimeId = async (): Promise<string> => {
    const animeId = await get<string>(GET_RANDOM_ANIME_URL, {}); //  Ожидаем строку (ID аниме)

    return animeId;
};
