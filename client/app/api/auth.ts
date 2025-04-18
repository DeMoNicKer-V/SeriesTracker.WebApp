import { LoginRequest } from "../Models/User/Requests/LoginRequest";
import { UserRequest } from "../Models/User/Requests/UserRequest";
import {
    LOGIN_URL,
    REGISTER_URL,
    LOGOUT_URL,
    VERIFY_URL,
    IS_EMAIL_URL,
    IS_USERNAME_URL,
} from "./endpoints";
import { get, post } from "./httpClient";

export const verify = async (
    email?: string,
    password?: string
): Promise<void> => {
    await post<void>(VERIFY_URL, { email, password });
};

export const login = async (credentials: LoginRequest): Promise<string> => {
    return await post<string>(LOGIN_URL, credentials);
};

export const register = async (userData: UserRequest): Promise<void> => {
    return await post(REGISTER_URL, userData);
};

export const logout = async (userName: string): Promise<void> => {
    const url = LOGOUT_URL.replace("{userName}", userName);
    await post<void>(url, {});
};

export const isEmailExists = async (email: string) => {
    const url = IS_EMAIL_URL.replace("{email}", email);
    await get<void>(url, {});
};

export const isUserNameExists = async (userName: string) => {
    const url = IS_USERNAME_URL.replace("{userName}", userName);
    await get<void>(url, {});
};
