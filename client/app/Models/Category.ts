/**
 * @interface Category
 * @description Объект, представляющий категорию аниме (например, "Смотрю", "Запланировано").
 * @property {number} id Уникальный идентификатор категории.
 * @property {string} name Название категории.
 * @property {string} color Цвет, используемый для отображения категории.
 * @property {string} prevColor Предыдущий цвет категории.
 * @property {string} date Дата создания/изменения категории.
 */
export interface Category {
    id: number;
    name: string;
    color: string;
    prevColor: string;
    date: string;
}
