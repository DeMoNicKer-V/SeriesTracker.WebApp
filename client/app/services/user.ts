import cookie from "cookie";
import axios, { parseCookies } from "nookies";
import { getCookie } from "cookies-next";
export interface UserReqruest {
    email: string;
    password: string;
    nickname: string;
    name: string;
    surName: string;
    avatar: string;
    dateBirth: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const registerUser = async (request: UserReqruest) => {
    const response = await fetch(`http://localhost:5125/user/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

export const loginUser = async (request: LoginRequest) => {
    const response = await fetch(`http://localhost:5125/user/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    });
    await response.json();
};
