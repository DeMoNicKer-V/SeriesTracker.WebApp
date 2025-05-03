/**
 * @interface SeriesGroup
 * @description Объект, представляющий группу аниме пользователя.
 * @property {string} id Уникальный идентификатор группы.
 * @property {number} seriesCount Количество аниме в группе.
 * @property {string} color Цвет, используемый для отображения группы.
 */
export interface SeriesGroup {
    id: string;
    seriesCount: number;
    color: string;
}

/**
 * @interface SeriesGroupProfile
 * @description Объект, представляющий профиль группы аниме пользователя (расширение SeriesGroup).
 * @property {string} id Уникальный идентификатор группы.
 * @property {number} seriesCount Количество аниме в группе.
 * @property {string} color Цвет, используемый для отображения группы.
 * @property {string} name Название группы.
 */
export interface SeriesGroupProfile extends SeriesGroup {
    name: string;
}
