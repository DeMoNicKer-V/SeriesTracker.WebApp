/**
 * @interface ShikimoriRequest
 * @description Объект, представляющий параметры запроса к API Shikimori.
 * @property {number} page Номер страницы результатов (для пагинации).
 * @property {string} [name] Поисковый запрос по названию аниме (опционально).
 * @property {string} [ids] Список идентификаторов аниме (через запятую) (опционально).
 * @property {string} [season] Сезон аниме (например, "summer_2023") (опционально).
 * @property {string} [status] Статус аниме (например, "ongoing", "released") (опционально).
 * @property {string} [kind] Тип аниме (например, "tv", "movie") (опционально).
 * @property {string} [genre] Список идентификаторов жанров (через запятую) (опционально).
 * @property {string} [order] Параметр сортировки результатов (например, "ranked", "popularity") (опционально).
 * @property {boolean} [censored] Признак того, что нужно исключить цензурированный контент (опционально).
 */
export interface ShikimoriRequest {
    page: number;
    name?: string;
    ids?: string;
    season?: string;
    status?: string;
    kind?: string;
    genre?: string;
    order?: string;
    censored?: boolean;
}

/**
 * @constant defaultShikimoriRequest
 * @description Объект с дефолтными значениями для ShikimoriRequest.
 */
export const defaultShikimoriRequest: ShikimoriRequest = {
    page: 0,
    name: "",
    ids: "",
    season: "",
    status: "",
    kind: "",
    genre: "",
    order: "",
    censored: true,
};
