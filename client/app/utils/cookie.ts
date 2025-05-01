// utils/cookie.ts
"use server"; //  Указываем, что это серверный компонент (важно для Next.js)

// Импортируем функцию для декодирования JWT (JSON Web Token)
import { jwtDecode } from "jwt-decode";

// Импортируем cookies для работы с куками
import { cookies } from "next/headers";

// Интерфейс для типа данных UserToken
export interface UserToken {
    userName: string; // Имя пользователя
    userId: string; // ID пользователя
    roleId: string; // ID роли пользователя
}

// Асинхронная функция для получения декодированного токена пользователя из куки
export async function getDecodedUserToken(): Promise<UserToken | null> {
    //  Получаем доступ к хранилищу куки
    const cookieStore = cookies();

    //  Проверяем наличие куки 'secretCookie'
    const hasCookie = cookieStore.has("secretCookie");

    //  Если кука существует, продолжаем
    if (hasCookie) {
        try {
            //  Получаем значение куки 'secretCookie' (то есть, JWT)
            const jwt: string | undefined = cookieStore
                .get("secretCookie")
                ?.value?.toString();

            //  Если значение куки отсутствует, выдаем предупреждение и возвращаем null
            if (!jwt) {
                console.warn(
                    "Куки 'secretCookie' существует, но значение отсутствует."
                );
                return null; // Куки есть, но значение отсутствует
            }

            //  Декодируем JWT (JSON Web Token)
            const decodedToken: UserToken = jwtDecode<UserToken>(jwt);

            //  Проверяем, что декодированный токен является объектом и содержит необходимые поля
            if (!decodedToken || typeof decodedToken !== "object") {
                console.warn(
                    "Некорректный формат JWT или отсутствуют обязательные поля (userId, roleId)."
                );
                return null; // Некорректный JWT
            }

            //  Возвращаем декодированный токен
            return decodedToken;
        } catch (error) {
            console.error("Ошибка декодирования JWT:", error);
            return null; //  Возвращаем null в случае ошибки
        }
    }

    //  Если кука отсутствует, возвращаем null
    return null;
}
