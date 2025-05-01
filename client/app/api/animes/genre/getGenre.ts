// api/anime/getGenre.ts

// Импортируем эндпоинт для получения жанров
import { GET_GENRES_URL } from "../../endpoints";

// Импортируем функцию get для выполнения HTTP-запросов
import { get } from "../../httpClient";

// Функция для получения списка жанров
export const getGenres = async (): Promise<Genre[]> => {
    const genres = await get<Genre[]>(GET_GENRES_URL, {}); //  Ожидаем массив объектов Genre

    return genres;
};
