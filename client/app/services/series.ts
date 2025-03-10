import { Series } from "../Models/Series/Series";

export interface SeriesRequest {
    animeId: number;
    watchedEpisode: number;
    categoryId: number;
    isFavorite: boolean;
}

export const getAllSeriesCount = async () => {
    const response = await fetch("http://localhost:5125/controller");
    return response.json();
};

export const getAllSeries = async (page: number, query: any) => {
    if (query === null || query === undefined) {
        query = null;
    }
    const response = await fetch(
        `http://localhost:5125/controller/${page}/${query}`
    );
    const series: Series = await response.json();

    return series;
};

export const getAlphabetSeries = async (page: number, query: any) => {
    if (query === null || query === undefined) {
        query = null;
    }
    const response = await fetch(
        `http://localhost:5125/controller/${page}/${query}`
    );
    const series: Series = await response.json();

    return series;
};

export const getSeriesSearch = async (page: number, query: any) => {
    if (query === null || query === undefined) {
        query = null;
    }
    const response = await fetch(
        `http://localhost:5125/controller/${page}/search/${query}`
    );
    const series: Series = await response.json();

    return series;
};

export const getSeriesById = async (id: string) => {
    const response = await fetch(`http://localhost:5125/controller/id/${id}`);
    const series: Series = await response.json();
    return series;
};

export const getAllSeriesSearch = async (query: any) => {
    if (query === "") {
        return;
    }
    const response = await fetch(`http://localhost:5125/controller/${query}`);

    const series: Series = await response.json();
    return series;
};

export const createSeries = async (seriesReqruest: SeriesRequest) => {
    const response = await fetch("http://localhost:5125/controller", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(seriesReqruest),
        credentials: "include",
    });
    if (!response.ok) {
        // Обрабатываем ошибку, если запрос не удался
        console.error("Ошибка при удалении данных:", response.status);
        // Можно показать пользователю сообщение об ошибке
        return;
    }
};

export const updateSeries = async (
    id: string,
    seriesReqruest: SeriesRequest
) => {
    const response = await fetch(
        `http://localhost:5125/controller/updateSeries/${id}`,
        {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(seriesReqruest),
        }
    );
    if (!response.ok) {
        // Обрабатываем ошибку, если запрос не удался
        console.error("Ошибка при удалении данных:", response.status);
        // Можно показать пользователю сообщение об ошибке
        return;
    }
};

export const deleteSeries = async (id: string) => {
    const response = await fetch(
        `http://localhost:5125/controller/deleteSeries/${id}`,
        {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
        }
    );
    if (!response.ok) {
        // Обрабатываем ошибку, если запрос не удался
        console.error("Ошибка при удалении данных:", response.status);
        // Можно показать пользователю сообщение об ошибке
        return;
    }
};

export const deleteSeriesByAnimeId = async (id: number) => {
    await fetch(`http://localhost:5125/controller/animeId/${id}`, {
        method: "DELETE",
    });
};
