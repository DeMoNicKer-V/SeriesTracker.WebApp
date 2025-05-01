import { CalendarAnimeItem } from "@/app/Models/Anime/CalendarAnimeItem";
import { get } from "../../httpClient";

export const getCalendarAnimes = async (
    key: string
): Promise<CalendarAnimeItem[]> => {
    const items = await get<CalendarAnimeItem[]>(key, {});
    return items;
};
