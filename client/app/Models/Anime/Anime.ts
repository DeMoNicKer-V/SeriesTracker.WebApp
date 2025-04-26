export interface Anime {
    id: number;
    title: string;
    subTitle: string;
    description?: string;
    duration: number;
    genres: [];
    startDate: string;
    episodes: number;
    score: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
    screenshots: Screenshot[];
    relateds: Related[];
    seriesId: string;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    watchedEpisodes: number;
    addedDate: string;
    isFavorite: boolean;
}

export interface Screenshot {
    id: number;
    originalUrl: string;
}

export interface Related {
    anime: Anime;
    relationText: string;
}

export const defaultAnimeValues: Anime = {
    id: 0,
    title: "",
    subTitle: "",
    description: "",
    genres: [],
    startDate: "",
    score: 0,
    episodes: 0,
    duration: 0,
    rating: "",
    kind: "",
    status: "",
    pictureUrl: "",
    screenshots: [],
    relateds: [],
    seriesId: "",
    categoryId: 0,
    categoryName: "",
    categoryColor: "",
    watchedEpisodes: 0,
    addedDate: "",
    isFavorite: false,
    //  дефолтные значения для полей Anime
};
