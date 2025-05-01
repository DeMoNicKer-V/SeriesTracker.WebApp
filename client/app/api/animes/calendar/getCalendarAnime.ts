// api/anime/getCalendarAnimes.ts

// Импортируем тип данных CalendarAnimeItem
import { CalendarAnimeItem } from "@/app/models/anime/CalendarAnimeItem";

// Импортируем функцию get для выполнения HTTP-запросов
import { get } from "../../httpClient";

// Функция для получения выходящих аниме (онгоингов)
export const getCalendarAnimes = async (
    url: string
): Promise<CalendarAnimeItem[]> => {
    const items = await get<CalendarAnimeItem[]>(url, {}); //  Ожидаем массив объектов CalendarAnimeItem

    return items;
};
