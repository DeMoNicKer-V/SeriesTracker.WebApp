/**
 * @interface LastActivitySeriesAnime
 * @description Объект, представляющий информацию о последней активности пользователя, связанной с аниме.
 * @property {number} id Уникальный идентификатор аниме.
 * @property {string} image URL изображения аниме.
 * @property {string} title Название аниме.
 * @property {string} date Дата последней активности.
 */
export interface LastActivitySeriesAnime {
    id: number;
    image: string;
    title: string;
    date: string;
}
