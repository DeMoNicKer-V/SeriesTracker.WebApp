export const getCategoryList = async () => {
    const response = await fetch("http://localhost:5125/category");
    return response.json();
};

export const getCategoryById = async (id: number) => {
    const response = await fetch(`http://localhost:5125/category/${id}`);
    return response.json();
};
