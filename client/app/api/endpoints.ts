//  базовый URL (он один для всего API):
export const BASE_API_URL = "http://localhost:5125";

export const LOGIN_URL = `${BASE_API_URL}/auth/login`;
export const REGISTER_URL = `${BASE_API_URL}/auth/register`;
export const GET_USER_URL = `${BASE_API_URL}/user/{id}`;
export const UPDATE_USER_URL = `${BASE_API_URL}/user/{id}`;
export const GET_USER_PROFILE_URL = `${BASE_API_URL}/user/profile`;
