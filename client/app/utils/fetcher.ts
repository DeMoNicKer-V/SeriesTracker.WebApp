const fetcher = async (url: string) => {
    const res = await fetch(url);
    //  Проверяем ошибки HTTP
    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        //  Добавляем дополнительную информацию об ошибке
        error.message = await res.text(); //  Или используйте res.json() для JSON
        throw error;
    }
    return res.json(); //  Возвращаем данные в формате JSON
};

export { fetcher };
