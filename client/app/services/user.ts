import cookie from "cookie";
import axios, { parseCookies } from "nookies";
import { getCookie } from "cookies-next";
export interface UserRequest {
    email: string;
    password: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
}

export interface UserResponse {
    email: string;
    password: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
    permissions: number[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const registerUser = async (request: UserRequest) => {
    const response = await fetch(`http://localhost:5125/user/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

export const login = async (request: LoginRequest) => {
    const response = await fetch(`http://localhost:5125/user/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    });
    if (response.status !== 200) {
        return await response.json();
    }
    await response.json();
};

export const getUserById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/user/${id}`);
    const user: UserResponse = await response.json();

    return user;
};
