/**
 * @interface CalendarAnimeItem
 * @description Объект, представляющий информацию об аниме в календаре (дата выхода новых эпизодов).
 * @property {number} nextEpisode Номер следующего эпизода.
 * @property {string} nextEpisodeAt Дата и время выхода следующего эпизода.
 * @property {number} duration Продолжительность эпизода (в минутах).
 * @property {CalendarAnime} anime Объект, содержащий основную информацию об аниме.
 */
export interface CalendarAnimeItem {
    nextEpisode: number;
    nextEpisodeAt: string;
    duration: number;
    anime: CalendarAnime;
}

/**
 * @interface CalendarAnime
 * @description Объект, представляющий основную информацию об аниме для календаря.
 * @property {number} id Уникальный идентификатор аниме.
 * @property {string} name Название аниме на английском языке.
 * @property {string} russian Название аниме на русском языке.
 * @property {CalendarAnimeImage} image Объект, содержащий URL изображений аниме.
 * @property {string} url URL страницы аниме на Shikimori.
 * @property {string} kind Тип аниме (например, "tv", "movie", "ova").
 * @property {string} score Рейтинг аниме.
 * @property {string} status Статус аниме (например, "ongoing", "released", "anons").
 * @property {number} episodes Общее количество эпизодов.
 * @property {number} episodesAired Количество уже вышедших эпизодов.
 * @property {string} airedOn Дата начала показа аниме.
 * @property {string} releasedOn Дата выхода последнего эпизода (если аниме завершено).
 */
interface CalendarAnime {
    id: number;
    name: string;
    russian: string;
    image: CalendarAnimeImage;
    url: string;
    kind: string;
    score: string;
    status: string;
    episodes: number;
    episodesAired: number;
    airedOn: string;
    releasedOn: string;
}

/**
 * @interface CalendarAnimeImage
 * @description Объект, представляющий URL изображений аниме для календаря.
 * @property {string} original URL оригинального изображения.
 * @property {string} preview URL превью изображения.
 */
interface CalendarAnimeImage {
    original: string;
    preview: string;
}

/**
 * @constant defaultCalendarAnimeValues
 * @description Объект с дефолтными значениями для CalendarAnimeItem.
 */
export const defaultCalendarAnimeValues: CalendarAnimeItem = {
    nextEpisode: 0,
    nextEpisodeAt: "",
    duration: 0,
    anime: {
        id: 0,
        name: "",
        russian: "",
        image: {
            original: "",
            preview: "",
        },
        url: "",
        kind: "",
        score: "",
        status: "",
        episodes: 0,
        episodesAired: 0,
        airedOn: "",
        releasedOn: "",
    },
};
