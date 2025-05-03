/**
 * @interface LoginRequest
 * @description Запрос для входа пользователя в систему
 * @property {string} [email] Email пользователя (может быть null)
 * @property {string} [password] Пароль пользователя (может быть null)
 */
export interface LoginRequest {
    email?: string;
    password?: string;
}
