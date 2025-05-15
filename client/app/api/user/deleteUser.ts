// api/user/deleteUser.ts

// Импортируем эндпоинты из файла endpoints.ts
import {
    DELETE_USER_SELF_URL, //  URL для удаления своего аккаунта
    DELETE_USER_SERIES_URL, //  URL для удаления аниме из списка пользователя
    DELETE_USER_URL, //  URL для удаления пользователя
} from "../endpoints";

// Импортируем функцию del для выполнения HTTP-запросов из файла httpClient.ts
import { del } from "../httpClient";

// Функция для удаления пользователя
export const deleteUser = async (userName: string): Promise<void> => {
    const url = DELETE_USER_URL.replace("{userName}", userName);
    await del(url);
};

// Функция для удаления своего аккаунта
export const deleteSelfUser = async (userName: string): Promise<void> => {
    const url = DELETE_USER_SELF_URL.replace("{userName}", userName);
    await del(url);
};

// Функция для удаления всего списка аниме пользователя
export const deleteUserSeries = async (userName: string) => {
    const url = DELETE_USER_SERIES_URL.replace("{userName}", userName);
    await del(url);
};
