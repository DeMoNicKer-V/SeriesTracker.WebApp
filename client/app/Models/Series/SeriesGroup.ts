export interface SeriesGroup {
    id: string;
    seriesCount: number;
    color: string;
}

export interface SeriesGroupProfile extends SeriesGroup {
    name: string;
}
