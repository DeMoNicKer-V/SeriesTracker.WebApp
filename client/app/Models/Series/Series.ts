/**
 * @interface Series
 * @description Объект, представляющий информацию о конкретной аниме в списке пользователя.
 * @property {string} id Уникальный идентификатор.
 * @property {number} animeId Идентификатор аниме.
 * @property {number} watchedEpisode Количество просмотренных эпизодов.
 * @property {string} addedDate Дата добавления в список пользователя.
 * @property {string} changedDate Дата последнего изменения.
 * @property {number} categoryId Идентификатор категории.
 * @property {boolean} isFavorite Признак того, что аниме добавлено в избранное.
 */
export interface Series {
    id: string;
    animeId: number;
    watchedEpisode: number;
    addedDate: string;
    changedDate: string;
    categoryId: number;
    isFavorite: boolean;
}

/**
 * @constant defaultSeriesValues
 * @description Объект с дефолтными значениями для Series.
 * @property {string} id Default: "". Уникальный идентификатор.
 * @property {number} animeId Default: 0. Идентификатор аниме.
 * @property {number} watchedEpisode Default: 0. Количество просмотренных эпизодов.
 * @property {string} addedDate Default: "". Дата добавления в список пользователя.
 * @property {string} changedDate Default: "". Дата последнего изменения информации.
 * @property {number} categoryId Default: 0. Идентификатор категории.
 * @property {boolean} isFavorite Default: false. Признак того, что аниме добавлено в избранное.
 */
export const defaultSeriesValues: Series = {
    id: "",
    animeId: 0,
    watchedEpisode: 0,
    addedDate: "",
    changedDate: "",
    categoryId: 0,
    isFavorite: false,
};
