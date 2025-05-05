import { SeriesGroupProfile } from "../series/SeriesGroup";

/**
 * @interface MainUserInfo
 * @description Объект, представляющий основную информацию о пользователе.
 * @property {string} email Адрес электронной почты пользователя.
 * @property {string} userName Имя пользователя (никнейм).
 * @property {string} avatar URL аватара пользователя.
 * @property {string} name Имя пользователя.
 * @property {string} surName Фамилия пользователя.
 * @property {string} dateBirth Дата рождения пользователя.
 * @property {string} regDate Дата регистрации пользователя.
 * @property {number} roleId Идентификатор роли пользователя.
 * @property {SeriesGroupProfile[]} seriesGroup Массив объектов SeriesGroupProfile, представляющих группы аниме, связанные с пользователем.
 * @property {string} seriesIDS Строка, содержащая идентификаторы аниме, связанных с пользователем.
 */
export interface MainUserInfo {
    email: string;
    userName: string;
    avatar: string;
    name: string;
    surName: string;
    dateBirth: string;
    regDate: string;
    roleId: number;
    seriesGroup: SeriesGroupProfile[];
    seriesIDS: string;
}

/**
 * @constant defaultUserValues
 * @description Объект с дефолтными значениями для MainUserInfo.
 */
export const defaultUserValues: MainUserInfo = {
    email: "",
    userName: "",
    avatar: "",
    name: "",
    surName: "",
    dateBirth: "",
    regDate: "",
    roleId: 0,
    seriesGroup: [],
    seriesIDS: "",
};
