interface Anime {
    id: string;
    title: string;
    subTitle: string;
    description: string;
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
    categoryId: number;
    categoryName: string;
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
