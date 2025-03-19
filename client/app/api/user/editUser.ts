import { UserRequest } from "@/app/Models/User/Requests/UserRequest";
import { CHANGE_USER_ROLE_URL, UPDATE_USER_URL } from "../endpoints";
import { put } from "../httpClient";

// Изменение пользователя по его userName
export const updateUser = async (
    userName: string,
    userRequset: UserRequest
): Promise<void> => {
    const url = UPDATE_USER_URL.replace("{userName}", userName);
    await put(url, userRequset);
};

// Смена роли пользователя на roleId по userId
export const changeUserRole = async (
    userId: string,
    roleId: number
): Promise<void> => {
    const url = CHANGE_USER_ROLE_URL.replace("{userId}", userId);
    await put(url, roleId);
};
