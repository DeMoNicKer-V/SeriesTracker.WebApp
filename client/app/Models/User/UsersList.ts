/**
 * @interface UsersList
 * @description Объект, представляющий список пользователей с общей информацией о количестве.
 * @property {UserItem[]} users Массив объектов UserItem, представляющих пользователей на текущей странице.
 * @property {number} totalCount Общее количество пользователей в системе.
 */
export interface UsersList {
    users: UserItem[];
    totalCount: number;
}

/**
 * @interface UserItem
 * @description Объект, представляющий краткую информацию о пользователе для отображения в списке.
 * @property {string} id Уникальный идентификатор пользователя.
 * @property {string} userName Имя пользователя (никнейм).
 * @property {string} email Адрес электронной почты пользователя.
 * @property {string} regDate Дата регистрации пользователя.
 * @property {number} roleId Идентификатор роли пользователя.
 */
export interface UserItem {
    id: string;
    userName: string;
    email: string;
    regDate: string;
    roleId: number;
}
