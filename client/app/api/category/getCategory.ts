// api/category/getCategory.ts

// Импортируем тип данных Category
import { Category } from "@/app/models/Category";

// Импортируем эндпоинты
import { GET_ALL_CATEGORIES_URL, GET_CATEGORY_BY_ID_URL } from "../endpoints";

// Импортируем функцию get для выполнения HTTP-запросов
import { get } from "../httpClient";

// Получение списка всех категорий
export const getAllCategoriesList = async (): Promise<Category[]> => {
    const categories = await get<Category[]>(GET_ALL_CATEGORIES_URL, {}); //  Ожидаем массив объектов Category

    return categories;
};

// Получение категории по id
export const getCategoryById = async (id: number): Promise<Category> => {
    const url = GET_CATEGORY_BY_ID_URL.replace("{id}", id.toString());
    const category = await get<Category>(url, {}); //  Ожидаем объект Category

    return category;
};
