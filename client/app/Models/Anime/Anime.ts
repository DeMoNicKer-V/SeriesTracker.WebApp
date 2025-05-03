/**
 * @interface Anime
 * @description Объект, представляющий информацию об аниме из списка пользователя.
 * @property {number} id Уникальный идентификатор аниме.
 * @property {boolean} isFavorite Признак того, что аниме добавлено в избранное.
 * @property {string} title Основное название аниме.
 * @property {string} subTitle Дополнительное название аниме (например, оригинальное название).
 * @property {string} description Описание аниме.
 * @property {string} startDate Дата начала показа аниме.
 * @property {number} score Рейтинг аниме (например, средняя оценка пользователей).
 * @property {number} episodes Общее количество эпизодов в аниме.
 * @property {number} episodesAired Количество уже вышедших эпизодов.
 * @property {number} duration Продолжительность одного эпизода (в минутах).
 * @property {string} rating Возрастной рейтинг аниме (например, "PG-13", "R-17").
 * @property {string} kind Тип аниме (например, "tv", "movie", "ova").
 * @property {string} status Статус аниме (например, "ongoing", "released", "anons").
 * @property {string} pictureUrl URL изображения аниме.
 * @property {number} categoryId Идентификатор категории, к которой относится аниме (например, "Смотрю", "Запланировано").
 * @property {string} categoryName Название категории, к которой относится аниме.
 * @property {string} categoryColor Цвет, используемый для отображения категории.
 * @property {string} changedDate Дата последнего изменения информации об аниме в списке пользователя.
 */
export interface Anime {
    id: number;
    isFavorite: boolean;
    title: string;
    subTitle: string;
    description: string;
    startDate: string;
    score: number;
    episodes: number;
    episodesAired: number;
    duration: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    changedDate: string;
}

/**
 * @constant defaultAnimeValues
 * @description Объект с дефолтными значениями для Anime.
 * @property {number} id Default: 0. Уникальный идентификатор аниме.
 * @property {boolean} isFavorite Default: false. Признак того, что аниме добавлено в избранное.
 * @property {string} title Default: "". Основное название аниме.
 * @property {string} subTitle Default: "". Дополнительное название аниме.
 * @property {string} description Default: "". Описание аниме.
 * @property {string} startDate Default: "". Дата начала показа аниме.
 * @property {number} score Default: 0. Рейтинг аниме.
 * @property {number} episodes Default: 0. Общее количество эпизодов.
 * @property {number} episodesAired Default: 0. Количество уже вышедших эпизодов.
 * @property {number} duration Default: 0. Продолжительность одного эпизода.
 * @property {string} rating Default: "". Возрастной рейтинг аниме.
 * @property {string} kind Default: "". Тип аниме.
 * @property {string} status Default: "". Статус аниме.
 * @property {string} pictureUrl Default: "". URL изображения аниме.
 * @property {number} categoryId Default: 0. Идентификатор категории.
 * @property {string} categoryName Default: "". Название категории.
 * @property {string} categoryColor Default: "". Цвет категории.
 * @property {string} changedDate Default: "". Дата последнего изменения информации.
 */
export const defaultAnimeValues: Anime = {
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
