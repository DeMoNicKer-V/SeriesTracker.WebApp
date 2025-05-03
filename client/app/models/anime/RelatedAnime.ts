/**
 * @interface RelatedAnime
 * @description Объект, представляющий информацию об аниме, связанном с текущим аниме.
 * @property {number} id Уникальный идентификатор аниме.
 * @property {string} title Основное название аниме.
 * @property {string} subTitle Дополнительное название аниме.
 * @property {string} startDate Дата начала показа аниме.
 * @property {string} kind Тип аниме (например, "tv", "movie", "ova").
 * @property {string} status Статус аниме (например, "ongoing", "released", "anons").
 * @property {string} pictureUrl URL изображения аниме.
 */
export interface RelatedAnime {
    id: number;
    title: string;
    subTitle: string;
    startDate: string;
    kind: string;
    status: string;
    pictureUrl: string;
}

/**
 * @interface Related
 * @description Объект, представляющий связь между текущим аниме и связанным аниме.
 * @property {RelatedAnime} anime Объект RelatedAnime, содержащий информацию о связанном аниме.
 * @property {string} relationText Описание связи между этим аниме и текущим аниме.
 */
export interface Related {
    anime: RelatedAnime;
    relationText: string;
}
