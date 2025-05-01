// utils/api.ts

// Импортируем базовый URL для API из файла endpoints
import { BASE_API_URL } from "./endpoints";

// Асинхронная функция для выполнения HTTP-запросов к API
async function request<T>(
    url: string, // URL для запроса (относительно BASE_API_URL)
    method: string = "GET", // HTTP-метод (по умолчанию GET)
    body: any = null, // Тело запроса (для POST, PUT и т.д.)
    headers: HeadersInit = {} // Дополнительные заголовки запроса
): Promise<T> {
    // Формируем параметры запроса
    const options: RequestInit = {
        method, // HTTP-метод
        headers: {
            "Content-Type": "application/json", // Устанавливаем Content-Type по умолчанию в application/json
            ...headers, // Добавляем пользовательские заголовки
        },
        credentials: "include", // Включаем куки и авторизационные данные (если есть)
    };

    // Если есть тело запроса, преобразуем его в JSON и добавляем в параметры
    if (body) {
        options.body = JSON.stringify(body);
    }

    // Выполняем запрос к API, используя fetch
    const response = await fetch(`${BASE_API_URL}${url}`, options);

    // Обрабатываем ошибки HTTP-ответов
    if (!response.ok) {
        let errorMessage = "Произошла ошибка. Попробуйте позже."; // Сообщение об ошибке по умолчанию
        try {
            const errorData = await response.json(); // Пытаемся получить данные об ошибке из ответа (в формате JSON)
            errorMessage = errorData.message || errorMessage; // Используем сообщение об ошибке из ответа, если оно есть
        } catch (error) {
            console.error("Ошибка при разборе JSON:", error); // Логируем ошибку, если не удалось распарсить JSON
        }
        throw new Error(errorMessage); //  Выбрасываем исключение с сообщением об ошибке
    }

    // Обрабатываем успешные ответы

    // Если статус ответа 204 No Content, возвращаем пустой объект (или null, или значение по умолчанию)
    if (response.status === 204) {
        return {} as T;
    } else {
        // Если ответ содержит данные, пытаемся распарсить JSON
        try {
            return (await response.json()) as T; // Возвращаем распарсенные данные (с приведением типов)
        } catch (error) {
            // Если ответ не в формате JSON, логируем предупреждение и возвращаем пустой объект
            console.warn("Ответ сервера не в формате JSON", response);
            return {} as T; // Return empty object.
        }
    }
}

// Вспомогательные функции для выполнения запросов с разными HTTP-методами

// Функция для выполнения GET-запросов
export const get = <T>(url: string, headers: HeadersInit = {}) =>
    request<T>(url, "GET", null, headers);

// Функция для выполнения POST-запросов
export const post = <T>(url: string, body: any, headers: HeadersInit = {}) =>
    request<T>(url, "POST", body, headers);

// Функция для выполнения PUT-запросов
export const put = <T>(url: string, body: any, headers: HeadersInit = {}) =>
    request<T>(url, "PUT", body, headers);

// Функция для выполнения DELETE-запросов
export const del = <T>(url: string, headers: HeadersInit = {}) =>
    request<T>(url, "DELETE", null, headers);

// Экспортируем базовую функцию request для большей гибкости (например, для нестандартных методов)
export default request;
