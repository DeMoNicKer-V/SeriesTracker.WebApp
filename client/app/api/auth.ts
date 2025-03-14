import { LoginRequest } from "../Models/User/Requests/LoginRequest";
import { UserRequest } from "../Models/User/Requests/UserRequest";
import { LOGIN_URL, REGISTER_URL, LOGOUT_URL, VERIFY_URL } from "./endpoints";
import { post } from "./httpClient";

export const verify = async (): Promise<void> => {
    await post<void>(VERIFY_URL, {});
};

export const login = async (credentials: LoginRequest): Promise<string> => {
    return await post<string>(LOGIN_URL, credentials);
};

export const register = async (userData: UserRequest): Promise<void> => {
    return await post(REGISTER_URL, userData);
};

export const logout = async (): Promise<void> => {
    await post<void>(LOGOUT_URL, {});
};
