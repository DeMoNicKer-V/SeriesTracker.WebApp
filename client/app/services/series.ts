import { headers } from "next/headers";

export interface SeriesReqruest {
    title: string;
    description: string;
    currentEpisode: number;
    lastEpisode: number;
    releaseDate: string;
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

export const getAllSeriesSearch = async (query: any) => {
    if (query === "") {
        return;
    }
    const response = await fetch(
        `http://localhost:5125/controller/search/${query}`
    );

    const series: Series["item1"] = await response.json();
    return series;
};

export const createSeries = async (seriesReqruest: SeriesReqruest) => {
    await fetch("http://localhost:5125/controller", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(seriesReqruest),
    });
};

export const updateSeries = async (
    id: string,
    seriesReqruest: SeriesReqruest
) => {
    await fetch(`http://localhost:5125/controller/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(seriesReqruest),
    });
};

export const deleteSeries = async (id: string) => {
    await fetch(`http://localhost:5125/controller/${id}`, {
        method: "DELETE",
    });
};
