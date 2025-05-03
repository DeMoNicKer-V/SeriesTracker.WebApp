// api/user/editUser.ts

// Импортируем типы данных (запросы)
import { CreateUserRequest } from "@/app/models/user/requests/CreateUserRequest"; //  Тип запроса для обновления пользователя

// Импортируем эндпоинты из файла endpoints.ts
import { CHANGE_USER_ROLE_URL, UPDATE_USER_URL } from "../endpoints";

// Импортируем функцию put для выполнения HTTP-запросов из файла httpClient.ts
import { put } from "../httpClient";

// Функция для обновления информации о пользователе
export const updateUser = async (
    userName: string,
    userRequset: CreateUserRequest
): Promise<void> => {
    const url = UPDATE_USER_URL.replace("{userName}", userName);

    await put(url, userRequset);
};

// Функция для изменения роли пользователя
export const changeUserRole = async (
    userId: string,
    roleId: number
): Promise<void> => {
    const url = CHANGE_USER_ROLE_URL.replace("{userId}", userId);
    await put(url, roleId);
};
