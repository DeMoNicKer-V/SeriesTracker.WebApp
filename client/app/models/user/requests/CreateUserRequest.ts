/**
 * @interface CreateCreateUserRequest
 * @description Запрос для регистрации нового пользователя.
 * @property {string} [email] Адрес электронной почты пользователя.
 * @property {string} [password] Пароль пользователя.
 * @property {string} [userName] Имя пользователя (никнейм).
 * @property {string} [avatar] URL аватара пользователя (может быть null).
 * @property {string} [name] Имя пользователя (может быть null).
 * @property {string} [surName] Фамилия пользователя (может быть null).
 * @property {string} [dateBirth] Дата рождения пользователя (может быть null).
 */
export interface CreateCreateUserRequest {
    email?: string;
    password?: string;
    userName?: string;
    avatar?: string;
    name?: string;
    surName?: string;
    dateBirth?: string;
}
