import { CreateSeriesRequest } from "@/app/Models/Requests/CreateSeriesRequest";
import { post } from "../httpClient";
import { CREATE_SERIES_URL } from "../endpoints";

// Добавить аниме в список
export const createSeries = async (
    seriesRequest: CreateSeriesRequest
): Promise<void> => {
    await post(CREATE_SERIES_URL, seriesRequest);
};
