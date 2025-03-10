export interface Series {
    id: string;
    animeId: number;
    watchedEpisode: number;
    addedDate: string;
    changedDate: string;
    categoryId: number;
    isFavorite: boolean;
}

export const defaultSeriesValues: Series = {
    id: "",
    animeId: 0,
    watchedEpisode: 0,
    addedDate: "",
    changedDate: "",
    categoryId: 0,
    isFavorite: false,
};
