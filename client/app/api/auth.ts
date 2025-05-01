// api/auth.ts

// Импортируем типы данных (запросы)
import { LoginRequest } from "../models/user/requests/LoginRequest"; //  Тип запроса для логина
import { UserRequest } from "../models/user/requests/UserRequest"; //  Тип запроса для регистрации

// Импортируем эндпоинты из файла endpoints.ts
import {
    IS_EMAIL_URL, //  URL для проверки существования email
    IS_USERNAME_URL, //  URL для проверки существования имени пользователя
    LOGIN_URL, //  URL для логина
    LOGOUT_URL, //  URL для выхода из системы
    REGISTER_URL, //  URL для регистрации
    VERIFY_URL, //  URL для верификации
} from "./endpoints";

// Импортируем функции для выполнения HTTP-запросов из файла httpClient.ts
import { get, post } from "./httpClient";

// Функция для верификации пользователя
export const verify = async (
    email?: string,
    password?: string
): Promise<void> => {
    await post<void>(VERIFY_URL, { email, password });
};

// Функция для логина пользователя
export const login = async (credentials: LoginRequest): Promise<string> => {
    return await post<string>(LOGIN_URL, credentials);
};

// Функция для регистрации нового пользователя
export const register = async (userData: UserRequest): Promise<void> => {
    return await post(REGISTER_URL, userData);
};

// Функция для выхода пользователя из системы
export const logout = async (userName: string): Promise<void> => {
    const url = LOGOUT_URL.replace("{userName}", userName);

    await post<void>(url, {});
};

// Функция для проверки, существует ли email
export const isEmailExists = async (email: string) => {
    const url = IS_EMAIL_URL.replace("{email}", email);

    await get<void>(url, {});
};

// Функция для проверки, существует ли имя пользователя
export const isUserNameExists = async (userName: string) => {
    const url = IS_USERNAME_URL.replace("{userName}", userName);

    await get<void>(url, {});
};
