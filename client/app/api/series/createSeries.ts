// api/series/createSeries.ts

// Импортируем тип запроса для добавления аниме в список
import { CreateSeriesRequest } from "@/app/models/requests/CreateSeriesRequest";

// Импортируем эндпоинт для добавления аниме в список
import { CREATE_SERIES_URL } from "../endpoints";

// Импортируем функцию post для выполнения HTTP-запросов
import { post } from "../httpClient";

// Функция для добавления аниме в список
export const createSeries = async (
    seriesRequest: CreateSeriesRequest
): Promise<void> => {
    await post(CREATE_SERIES_URL, seriesRequest); //  Передаем данные в теле запроса
};
