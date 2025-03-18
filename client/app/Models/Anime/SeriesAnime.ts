export interface SeriesAnime {
    id: number;
    isFavorite: boolean;
    title: string;
    subTitle: string;
    description: string;
    startDate: string;
    score: number;
    episodes: number;
    episodesAired: number;
    duration: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    changedDate: string;
}

export const defaultSeriesAnimeValues: SeriesAnime = {
    id: 0,
    isFavorite: false,
    title: "",
    subTitle: "",
    description: "",
    startDate: "",
    score: 0,
    episodes: 0,
    episodesAired: 0,
    duration: 0,
    rating: "",
    kind: "",
    status: "",
    pictureUrl: "",
    categoryId: 0,
    categoryName: "",
    categoryColor: "",
    changedDate: "",
    //  дефолтные значения для полей SeriesAnime
};
