// auth endpoints
export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const LOGOUT_URL = "/auth/logout";
export const VERIFY_URL = "/auth/verify";
export const IS_EMAIL_URL = "/auth/email?email={email}";
export const IS_USERNAME_URL = "/auth/userName?userName={userName}";
// auth endpoints

// getUser endpoints
export const GET_ALL_USERS_URL = "/user";
export const GET_USER_BY_ID_URL = "/user/id/{id}";
export const GET_USER_BY_USERNAME_URL = "/user/userName/{userName}";
export const GET_USER_BY_EMAIL_URL = "/user/email/{email}";

export const GET_SERIES_CATEGORIES_USER_URL =
    "/user/categoryCount?userName={userName}";
// getUser endpoints

// editUser endpoints
export const UPDATE_USER_URL = "/user/update/{userName}";
export const CHANGE_USER_ROLE_URL = "/user/changeUserRole/{userId}";
// editUser endpoints

// deleteUser endpoints
export const DELETE_USER_URL = "/user/deleteUser/{userName}";
export const DELETE_USER_SELF_URL = "/user/deleteSelf/{userName}";
export const DELETE_USER_SERIES_URL = "/user/deleteSeries/{userName}";
// deleteUser endpoints

//  базовый URL (он один для всего API):
export const BASE_API_URL = "http://localhost:5125";
