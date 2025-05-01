import { CreateSeriesRequest } from "@/app/Models/Requests/CreateSeriesRequest";
import { CREATE_SERIES_URL } from "../endpoints";
import { post } from "../httpClient";

// Добавить аниме в список
export const createSeries = async (
    seriesRequest: CreateSeriesRequest
): Promise<void> => {
    await post(CREATE_SERIES_URL, seriesRequest);
};
