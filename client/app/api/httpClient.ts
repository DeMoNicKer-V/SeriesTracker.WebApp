import { BASE_API_URL } from "./endpoints";

async function request<T>(
    url: string,
    method: string = "GET",
    body: any = null,
    headers: HeadersInit = {}
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json", // Default to JSON
            ...headers,
        },
        credentials: "include",
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_API_URL}${url}`, options);

    if (!response.ok) {
        let errorMessage = "Произошла ошибка. Попробуйте позже.";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (error) {
            console.error("Ошибка при разборе JSON:", error);
        }
        throw new Error(errorMessage);
    }

    // Проверяем код ответа перед попыткой распарсить JSON
    if (response.status === 204) {
        // 204 No Content: Не нужно распарсить JSON
        return {} as T; // Или вернуть null, или значение по умолчанию
    } else {
        // Код ответа OK: Пытаемся распарсить JSON
        try {
            return (await response.json()) as T;
        } catch (error) {
            console.warn("Ответ сервера не в формате JSON", response);
            return {} as T; // Return empty object.
        }
    }
}

export const get = <T>(url: string, headers: HeadersInit = {}) =>
    request<T>(url, "GET", null, headers);
export const post = <T>(url: string, body: any, headers: HeadersInit = {}) =>
    request<T>(url, "POST", body, headers);
export const put = <T>(url: string, body: any, headers: HeadersInit = {}) =>
    request<T>(url, "PUT", body, headers);
export const del = <T>(url: string, headers: HeadersInit = {}) =>
    request<T>(url, "DELETE", null, headers);

export default request; // Export the base function for more flexibility
