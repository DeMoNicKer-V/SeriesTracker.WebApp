interface Series {
    userInfo: UserInfo;
    animeInfo: AnimeInfo;
    count: number;
}

interface UserInfo {
    id: string;
    watchedEpisode: number;
    addedDate: string;
    changedDate: string;
    categoryId: string;
    isFavorite: boolean;
}
interface AnimeInfo {
    id: string;
    title: string;
    Description: string;
    startDate: string;
    score: number;
    episodes: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
}
