//  базовый URL (он один для всего API):
export const BASE_API_URL = "http://localhost:5125";

// auth endpoints
export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const LOGOUT_URL = "/auth/logout/{userName}";
export const VERIFY_URL = "/auth/verify";
export const IS_EMAIL_URL = "/auth/email?email={email}";
export const IS_USERNAME_URL = "/auth/userName?userName={userName}";
// auth endpoints

// getUser endpoints
export const GET_ALL_USERS_URL = "/user/{page}";
export const GET_USER_BY_ID_URL = "/user/id/{id}";
export const GET_USER_BY_USERNAME_URL = "/series/{userName}";
export const GET_USER_BY_EMAIL_URL = "/user/email/{email}";

export const GET_SERIES_CATEGORIES_USER_URL = "/series/{userName}/group";
// getUser endpoints

// editUser endpoints
export const UPDATE_USER_URL = "/user/update/{userName}";
export const CHANGE_USER_ROLE_URL = "/user/changeRole/{userId}";
// editUser endpoints

// getCategory endpoints
export const GET_ALL_CATEGORIES_URL = "/category";
export const GET_CATEGORY_BY_ID_URL = "/category/{id}";
// getCategory endpoints

// editCategory endpoints
export const UPDATE_CATEGORY_URL = "/category/{id}";
// editCategory endpoints

// createSeries endpoints
export const CREATE_SERIES_URL = "/series/create";
// createSeries endpoints

// editSeries endpoints
export const UPDATE_SERIES_URL = "/series/update/{id}";
// editSeries endpoints

// deleteSeries endpoints
export const DELETE_SERIES_URL = "/series/delete/{id}";
export const DELETE_USER_SERIES_URL = "/series/{userName}/deleteAll";
// deleteSeries endpoints

// getAnime endpoints
export const GET_ANIMES_URL = "/animes?{query}";
export const GET_ANIME_BY_ID_URL = "/animes/id/{id}";
export const GET_USER_RECENT_ANIMES_URL =
    "/animes/activity?userName={userName}&id={id}";
export const GET_ANIMES_BY_NAME_URL = "/animes/{name}";
export const GET_RANDOM_ANIME_URL = "/animes/random";
// getAnime endpoints

// getCalendarAnimes endpoints
export const GET_CALENDAR_ANIMES_URL = "/animes/calendar";
// getCalendarAnimes endpoints

// getGenre endpoints
export const GET_GENRES_URL = "/animes/groupGenres";
// getGenre endpoints

// deleteUser endpoints
export const DELETE_USER_URL = "/user/{userName}/delete";
export const DELETE_USER_SELF_URL = "/user/{userName}/deleteSelf";
// deleteUser endpoints
