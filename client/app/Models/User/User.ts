/**
 * @interface User
 * @description Объект, представляющий полную информацию о пользователе.
 * @property {string} id Уникальный идентификатор пользователя.
 * @property {string} userName Имя пользователя (никнейм).
 * @property {string} name Имя пользователя.
 * @property {string} surName Фамилия пользователя.
 * @property {string} email Адрес электронной почты пользователя.
 * @property {string} avatar URL аватара пользователя.
 * @property {string} dateBirth Дата рождения пользователя.
 * @property {string} regDate Дата регистрации пользователя.
 * @property {number} roleId Идентификатор роли пользователя.
 */
interface User {
    id: string;
    userName: string;
    name: string;
    surName: string;
    email: string;
    avatar: string;
    dateBirth: string;
    regDate: string;
    roleId: number;
}
