interface Series {
    id: string;
    animeId: string;
    watchedEpisode: number;
    addedDate: string;
    changedDate: string;
    categoryId: string;
    isFavorite: boolean;
    title: string;
    subTitle: string;
    description: string;
    startDate: string;
    score: number;
    episodes: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
}
interface SeriesInfo {
    id: string;
    animeId: string;
    watchedEpisode: number;
    addedDate: string;
    changedDate: string;
    categoryId: number;
    isFavorite: boolean;
}
