// api/series/deleteSeries.ts

// Импортируем эндпоинт для удаления аниме из списка
import { DELETE_SERIES_URL } from "../endpoints";

// Импортируем функцию del для выполнения HTTP-запросов
import { del } from "../httpClient";

// Функция для удаления аниме из списка по id
export const deleteSeries = async (id: string): Promise<void> => {
    const url = DELETE_SERIES_URL.replace("{id}", id);
    await del(url, {});
};
