"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

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

export async function LogOut() {
    const cookieStore = cookies();
    cookieStore.delete("secretCookie");
}
