/**
 * @interface CreateSeriesRequest
 * @description Объект, представляющий запрос на добавление аниме в список пользователя.
 * @property {number} animeId Идентификатор аниме.
 * @property {number} categoryId Идентификатор категории.
 * @property {number} watchedEpisode Количество просмотренных эпизодов.
 * @property {boolean} isFavorite Признак того, что аниме добавлено в избранное.
 */
export interface CreateSeriesRequest {
    animeId: number;
    categoryId: number;
    watchedEpisode: number;
    isFavorite: boolean;
}
