import { UPDATE_CATEGORY_URL } from "../endpoints";
import { put } from "../httpClient";

// Изменение текущего цвета категории по id
export const editCategoryColor = async (
    id: number,
    color: string
): Promise<void> => {
    const url = UPDATE_CATEGORY_URL.replace("{id}", id.toString());
    await put(url, { color });
};
