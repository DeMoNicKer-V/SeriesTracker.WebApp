// api/category/editCategory.ts

// Импортируем эндпоинт для обновления категории
import { UPDATE_CATEGORY_URL } from "../endpoints";

// Импортируем функцию put для выполнения HTTP-запросов
import { put } from "../httpClient";

// Изменение текущего цвета категории по id
export const editCategoryColor = async (
    id: number,
    color: string
): Promise<void> => {
    const url = UPDATE_CATEGORY_URL.replace("{id}", id.toString());
    await put(url, { color });
};
