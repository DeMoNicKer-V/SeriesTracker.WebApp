import {
    DELETE_USER_SELF_URL,
    DELETE_USER_SERIES_URL,
    DELETE_USER_URL,
} from "../endpoints";
import { del } from "../httpClient";

// Удаление пользователя
export const deleteUser = async (userName: string): Promise<void> => {
    const url = DELETE_USER_URL.replace("{username}", userName);
    await del(url);
};

// Удаление своего аккаунта
export const deleteSelfUser = async (userName: string): Promise<void> => {
    const url = DELETE_USER_SELF_URL.replace("{username}", userName);
    await del(url);
};

// Удаление своего списка
export const deleteUserSeries = async (userName: string) => {
    const url = DELETE_USER_SERIES_URL.replace("{username}", userName);
    await del(url);
};
