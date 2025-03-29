import { MainUserInfo } from "@/app/Models/User/MainUserInfo";
import {
    GET_USER_BY_ID_URL,
    GET_USER_BY_EMAIL_URL,
    GET_USER_BY_USERNAME_URL,
    GET_ALL_USERS_URL,
    GET_SERIES_CATEGORIES_USER_URL,
    GET_SERIES_USER_URL,
} from "../endpoints";
import { get } from "../httpClient";
import { UsersList } from "@/app/Models/User/UsersList";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";

export interface CategoryCount {
    key: string;
    value: number;
    color: string;
}

export const getUserById = async (userId: string): Promise<User> => {
    const url = GET_USER_BY_ID_URL.replace("{id}", userId); // Формируем URL
    const user = await get<User>(url, {});
    return user;
};

export const getUserByEmail = async (email: string): Promise<User> => {
    const url = GET_USER_BY_EMAIL_URL.replace("{email}", email); // Формируем URL
    const user = await get<User>(url, {});
    return user;
};

export const getUserByUsername = async (
    userName: string
): Promise<MainUserInfo> => {
    const url = GET_USER_BY_USERNAME_URL.replace("{userName}", userName); // Формируем URL
    const user = await get<MainUserInfo>(url, {});
    return user;
};

export const getAllUsersList = async (page: number): Promise<UsersList> => {
    const url = GET_ALL_USERS_URL.replace("{page}", page.toString());
    const usersList = await get<UsersList>(url, {});
    return usersList;
};

export const getUserCategoriesCount = async (
    userName: string
): Promise<CategoryCount[]> => {
    const url = GET_SERIES_CATEGORIES_USER_URL.replace("{userName}", userName); // Формируем URL
    const categoriesList = await get<CategoryCount[]>(url, {});
    return categoriesList;
};

export const getUserSeries = async (
    userName: string,
    query: string
): Promise<SeriesAnime[]> => {
    const url = replaceMultiple(GET_SERIES_USER_URL, { userName, query });
    const ids = await get<SeriesAnime[]>(url, {});
    return ids;
};

function replaceMultiple(
    input: string,
    replacements: { [key: string]: string }
): string {
    const pattern = /\{(\w+)\}/g;

    return input.replace(pattern, (match, key) => {
        if (replacements.hasOwnProperty(key)) {
            return replacements[key];
        } else {
            return match;
        }
    });
}
