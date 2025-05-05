/**
 * @interface Genre
 * @description Объект, представляющий жанр аниме.
 * @property {string} id Уникальный идентификатор жанра.
 * @property {string} russian Название жанра на русском языке.
 */
interface Genre {
    id: string;
    russian: string;
}
/**
 * @interface Genre
 * @description Объект, представляющий категоризированные жанры.
 * @property {Genre[]} genre Массивов жанров (фэнтези, романтика...).
 * @property {Genre[]} theme Массивов жанров 'тема' (средневековье, взрослые персонажи...).
 * @property {Genre[]} demographic Массивов жанров 'аудитория' (сенен, сэйнен...).
 */
interface GroupGenre {
    genre: Genre[];
    theme: Genre[];
    demographic: Genre[];
}
