export const getCategoryList = async () => {
    const response = await fetch("http://localhost:5125/category");
    return response.json();
};
