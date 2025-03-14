// auth endpoints
export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const LOGOUT_URL = "/auth/logout";
export const VERIFY_URL = "/auth/verify";
// auth endpoints

// getUser endpoints
export const GET_ALL_USERS_URL = "/user";
export const GET_USER_BY_ID_URL = "/user/id/{id}";
export const GET_USER_BY_USERNAME_URL = "/user/username/{username}";
export const GET_USER_BY_EMAIL_URL = "/user/email/{email}";

export const GET_SERIES_CATEGORIES_USER_URL =
    "/user/categoryCount?username={username}";
// getUser endpoints

//  базовый URL (он один для всего API):
export const BASE_API_URL = "http://localhost:5125";
