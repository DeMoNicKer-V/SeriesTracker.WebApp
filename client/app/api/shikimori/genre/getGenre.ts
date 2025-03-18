import { GET_GENRES_URL } from "../../endpoints";
import { get } from "../../httpClient";

export const getGenres = async (): Promise<Genre[]> => {
    const genres = await get<Genre[]>(GET_GENRES_URL, {});
    return genres;
};
