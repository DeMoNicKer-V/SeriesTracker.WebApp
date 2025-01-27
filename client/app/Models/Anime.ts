interface Anime {
    id: string;
    title: string;
    subTitle: string;
    description?: string;
    duration: number;
    genres: string;
    startDate: string;
    episodes: number;
    score: number;
    rating: string;
    kind: string;
    status: string;
    pictureUrl: string;
    screenshots: Screenshot[];
    relateds: Related[];
}

interface Screenshot {
    id: number;
    originalUrl: string;
}

interface Related {
    anime: Anime;
    relationText: string;
}

interface RelatedAnime {
    id: number;
}

interface SeriesAnime {
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
}
