import { Anime } from "./Anime";
import { Related } from "./RelatedAnime";
import { Screenshot } from "./Screenshot";

/**
 * @interface AnimeDetail
 * @description Объект, представляющий полную информацию об аниме, включая скриншоты, связанные аниме и другую информацию.
 * @property {Genre[]} genres Массив жанров аниме.
 * @property {Screenshot[]} screenshots Массив объектов Screenshot, представляющих скриншоты из аниме.
 * @property {Related[]} relateds Массив объектов Related, представляющих связанные аниме.
 * @property {string} seriesId Идентификатор аниме в списке пользователя.
 * @property {number} watchedEpisodes Количество просмотренных эпизодов (для пользователя).
 * @property {string} addedDate Дата добавления аниме в список пользователя.
 * @property {number} id Уникальный идентификатор аниме.
 * @property {boolean} isFavorite Признак того, что аниме добавлено в избранное.
 * @property {string} title Основное название аниме.
 * @property {string} subTitle Дополнительное название аниме.
 * @property {string} description Описание аниме.
 * @property {string} startDate Дата начала показа аниме.
 * @property {number} score Рейтинг аниме.
 * @property {number} episodes Общее количество эпизодов.
 * @property {number} episodesAired Количество уже вышедших эпизодов.
 * @property {number} duration Продолжительность одного эпизода.
 * @property {string} rating Возрастной рейтинг аниме.
 * @property {string} kind Тип аниме.
 * @property {string} status Статус аниме.
 * @property {string} pictureUrl URL изображения аниме.
 * @property {number} categoryId Идентификатор категории.
 * @property {string} categoryName Название категории.
 * @property {string} categoryColor Цвет категории.
 * @property {string} changedDate Дата изменения.
 */
export interface AnimeDetail extends Anime {
    genres: Genre[];
    screenshots: Screenshot[];
    relateds: Related[];
    seriesId: string;
    watchedEpisodes: number;
    addedDate: string;
}

/**
 * @constant defaultAnimeDetailValues
 * @description Объект с дефолтными значениями для AnimeDetail.
 */
export const defaultAnimeDetailValues: AnimeDetail = {
    genres: [],
    screenshots: [],
    relateds: [],
    seriesId: "",
    watchedEpisodes: 0,
    addedDate: "",
    id: 0,
    isFavorite: false,
    title: "",
    subTitle: "",
    description: "",
    startDate: "",
    score: 0,
    episodes: 0,
    episodesAired: 0,
    duration: 0,
    rating: "",
    kind: "",
    status: "",
    pictureUrl: "",
    categoryId: 0,
    categoryName: "",
    categoryColor: "",
    changedDate: "",
};
