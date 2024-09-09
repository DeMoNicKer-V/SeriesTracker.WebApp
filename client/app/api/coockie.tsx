"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export default async function GetCoockie() {
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("secretCookie");
    if (hasCookie) {
        const a: string = cookieStore.get("secretCookie")?.value.toString();
        const decodedToken = jwtDecode(a); // Декодируем токен
        return decodedToken.userId;
    }
    return null;
}
