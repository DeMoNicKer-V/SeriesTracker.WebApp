import { DELETE_SERIES_URL } from "../endpoints";
import { del } from "../httpClient";

// Удаление аниме из списка по id
export const updateSeries = async (id: string): Promise<void> => {
    const url = DELETE_SERIES_URL.replace("{id}", id);
    await del(url, {});
};
