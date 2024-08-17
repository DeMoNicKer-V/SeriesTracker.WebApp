export const getCategoryList = async () => {
    const response = await fetch("http://localhost:5125/category");
    return response.json();
};

export const getCategoryById = async (id: number) => {
    const response = await fetch(`http://localhost:5125/category/${id}`);
    return response.json();
};

export interface CategoryRequest {
    title: string;
    color: string;
}
export const updateCategoryById = async (
    id: number,
    category: CategoryRequest
) => {
    await fetch(`http://localhost:5125/category/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(category),
    });
};
