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

export interface UserInfo {
    email: string;
    password: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
    regDate: string;
    yearsOld: number;
}

export interface SeriesInfo {
    id: number;
    name: string;
    color: string;
    seriesCount: number;
}

export interface MainUserInfo {
    userInfo: UserInfo;
    seriesInfo: SeriesInfo[];
    activityInfo: number[];
}
export interface LoginRequest {
    email: string;
    password: string;
}

export interface CategoryCount {
    key: string;
    value: number;
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
    const response = await fetch(`http://localhost:5125/user/id/${id}`);
    const user: UserInfo = await response.json();
    return user;
};

export const getUserCategoriesCount = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/categoryCount?username=${username}`
    );
    const series: CategoryCount[] = await response.json();
    return series;
};

export const checkExistEmail = async (email: string) => {
    const response = await fetch(
        `http://localhost:5125/user/email?email=${email}`
    );
    if (response.status !== 200) {
        return true;
    }
    return false;
};

export const checkExistUserName = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/username?username=${username}`
    );
    if (response.status !== 200) {
        return true;
    }
    return false;
};

export const getUserByUserName = async (username: string) => {
    const response = await fetch(
        `http://localhost:5125/user/username/${username}`
    );
    const user: MainUserInfo = await response.json();

    return user;
};
