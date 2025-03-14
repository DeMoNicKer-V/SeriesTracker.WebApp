"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { getUserById } from "./user/getUser";

interface UserToken {
    userId: string;
    roleId: string;
}
export async function GetCoockie() {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");
    if (hasCookie) {
        const a: string = cookieStore.get("secretCookie")?.value.toString();
        const decodedToken = jwtDecode(a); // Декодируем токен
        return decodedToken.userId;
    }
    return null;
}

export async function IsAuth() {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");

    return hasCookie;
}

export async function GetPermissions(permission: number) {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");
    if (hasCookie) {
        const a: string = cookieStore.get("secretCookie")?.value.toString();
        const decodedToken = jwtDecode(a); // Декодируем токен
        const user = await getUserById(decodedToken.userId);
        if (user?.permissions.includes(permission)) {
            return { userId: decodedToken.userId, roleId: decodedToken.roleId };
        }
    }
    return false;
}

export async function IsCurrentUser(username: string) {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");
    if (hasCookie) {
        const a: string = cookieStore.get("secretCookie")?.value.toString();
        const decodedToken = jwtDecode(a); // Декодируем токен
        return decodedToken.userName === username;
    }
    return hasCookie;
}

export async function GetDecodedUserToken() {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");
    if (hasCookie) {
        const jwt = cookieStore.get("secretCookie")?.value.toString();
        const decodedToken: UserToken =
            (jwt && jwtDecode(jwt)) ||
            ({ userId: "", roleId: "" } as UserToken);
        return decodedToken;
    }
    return { userId: "", roleId: "" } as UserToken;
}

export async function LogOut() {
    try {
        const cookieStore = cookies();
        cookieStore.delete("secretCookie");

        // Вызываем API logout на бэкенде
        const response = await fetch(`http://localhost:5125/auth/logout`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error(
                "Ошибка при вызове API logout:",
                response.status,
                response.statusText
            );
        }
    } catch (error) {
        console.error("Ошибка при выходе из системы:", error);
        //  Обработка ошибки
    }
}
