interface Series {
    item1: item1;
    item2: item2;
}

interface item1 {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    watchedEpisode: number;
    lastEpisode: number;
    duration: number;
    rating: number;
    releaseDate: string;
    addedDate: string;
    changedDate: string;
    overDate: string;
    isOver: boolean;
    isFavorite: boolean;
}
interface item2 {
    count: number;
}
