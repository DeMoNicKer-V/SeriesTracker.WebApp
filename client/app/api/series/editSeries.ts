import { CreateSeriesRequest } from "@/app/Models/Requests/CreateSeriesRequest";
import { UPDATE_SERIES_URL } from "../endpoints";
import { put } from "../httpClient";

// Изменение аниме из списка по id
export const updateSeries = async (
    id: string,
    seriesReqruest: CreateSeriesRequest
): Promise<void> => {
    const url = UPDATE_SERIES_URL.replace("{id}", id);
    await put(url, seriesReqruest);
};
