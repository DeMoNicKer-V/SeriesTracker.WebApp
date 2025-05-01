// api/series/updateSeries.ts

// Импортируем тип запроса для добавления аниме в список
import { CreateSeriesRequest } from "@/app/models/requests/CreateSeriesRequest";

// Импортируем эндпоинт для обновления сериала
import { UPDATE_SERIES_URL } from "../endpoints";

// Импортируем функцию put для выполнения HTTP-запросов
import { put } from "../httpClient";

// Функция для изменения аниме из списка по id
export const updateSeries = async (
    id: string,
    seriesReqruest: CreateSeriesRequest
): Promise<void> => {
    const url = UPDATE_SERIES_URL.replace("{id}", id);
    await put(url, seriesReqruest); //  Передаем данные в теле запроса
};
