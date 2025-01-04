"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../services/user";

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

export async function LogOut() {
    const cookieStore = cookies();
    cookieStore.delete("secretCookie");
}
