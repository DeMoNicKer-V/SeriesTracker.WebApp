import { CalendarAnimeItem } from "@/app/models/anime/CalendarAnimeItem";
import { get } from "../../httpClient";

export const getCalendarAnimes = async (
    key: string
): Promise<CalendarAnimeItem[]> => {
    const items = await get<CalendarAnimeItem[]>(key, {});
    return items;
};
