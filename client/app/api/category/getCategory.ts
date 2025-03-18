import { Category } from "@/app/Models/Category";
import { GET_ALL_CATEGORIES_URL, GET_CATEGORY_BY_ID_URL } from "../endpoints";
import { get } from "../httpClient";

// Получение списка всех категорий
export const getAllCategoriesList = async (): Promise<Category[]> => {
    const categories = await get<Category[]>(GET_ALL_CATEGORIES_URL, {});
    return categories;
};

// Получение категории по id
export const getCategoryById = async (id: number): Promise<Category> => {
    const url = GET_CATEGORY_BY_ID_URL.replace("{id}", id.toString());
    const category = await get<Category>(url, {});
    return category;
};
