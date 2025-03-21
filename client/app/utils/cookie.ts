// utils/cookie.ts
"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface UserToken {
    userName: string;
    userId: string;
    roleId: string;
}

export async function getDecodedUserToken(): Promise<UserToken | null> {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");

    if (hasCookie) {
        try {
            const jwt: string | undefined = cookieStore
                .get("secretCookie")
                ?.value?.toString();

            if (!jwt) {
                console.warn(
                    "Куки 'secretCookie' существует, но значение отсутствует."
                );
                return null; // Куки есть, но значение отсутствует
            }

            const decodedToken: UserToken = jwtDecode<UserToken>(jwt); // Декодируем токен

            if (!decodedToken || typeof decodedToken !== "object") {
                console.warn(
                    "Некорректный формат JWT или отсутствуют обязательные поля (userId, roleId)."
                );
                return null; // Некорректный JWT
            }

            return decodedToken;
        } catch (error) {
            console.error("Ошибка декодирования JWT:", error);
            return null; // Обрабатываем ошибки декодирования
        }
    }

    return null; // Куки отсутствует
}
