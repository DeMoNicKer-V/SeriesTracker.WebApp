// api/user/getUser.ts

// Импортируем типы данных (модели)
import { SeriesGroup } from "@/app/models/series/SeriesGroup"; //  Тип для группы аниме
import { MainUserInfo } from "@/app/models/user/MainUserInfo"; //  Тип для основной информации о пользователе
import { UsersList } from "@/app/models/user/UsersList"; //  Тип для списка пользователей

// Импортируем эндпоинты из файла endpoints.ts
import {
    GET_ALL_USERS_URL, //  URL для получения списка пользователей
    GET_SERIES_CATEGORIES_USER_URL, //  URL для получения категорий аниме в списке пользователя пользователя
    GET_USER_BY_EMAIL_URL, //  URL для получения пользователя по email
    GET_USER_BY_ID_URL, //  URL для получения пользователя по ID
    GET_USER_BY_USERNAME_URL, //  URL для получения пользователя по имени пользователя
} from "../endpoints";

// Импортируем функцию get для выполнения HTTP-запросов из файла httpClient.ts
import { get } from "../httpClient";

// Функция для получения пользователя по ID
export const getUserById = async (userId: string): Promise<User> => {
    const url = GET_USER_BY_ID_URL.replace("{id}", userId);
    const user = await get<User>(url, {}); //  Ожидаем объект User

    return user;
};

// Функция для получения пользователя по email
export const getUserByEmail = async (email: string): Promise<User> => {
    const url = GET_USER_BY_EMAIL_URL.replace("{email}", email);
    const user = await get<User>(url, {}); //  Ожидаем объект User

    return user;
};

// Функция для получения пользователя по имени пользователя
export const getUserByUsername = async (
    userName: string
): Promise<MainUserInfo> => {
    const url = GET_USER_BY_USERNAME_URL.replace("{userName}", userName);
    const user = await get<MainUserInfo>(url, {}); //  Ожидаем объект MainUserInfo

    return user;
};

// Функция для получения списка пользователей (с пагинацией)
export const getAllUsersList = async (page: number): Promise<UsersList> => {
    const url = GET_ALL_USERS_URL.replace("{page}", page.toString());
    const usersList = await get<UsersList>(url, {}); //  Ожидаем объект UsersList

    return usersList;
};

// Функция для получения списка категорий аниме пользователя
export const getUserCategoriesCount = async (
    userName: string
): Promise<SeriesGroup[]> => {
    const url = GET_SERIES_CATEGORIES_USER_URL.replace("{userName}", userName);
    const categoriesList = await get<SeriesGroup[]>(url, {}); //  Ожидаем массив объектов SeriesGroup

    return categoriesList;
};
