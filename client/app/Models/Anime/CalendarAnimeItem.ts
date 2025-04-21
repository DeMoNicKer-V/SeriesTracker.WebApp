export interface CalendarAnimeItem {
    nextEpisode: number;
    nextEpisodeAt: string;
    duration: number;
    anime: CalendarAnime;
}

interface CalendarAnime {
    id: number;
    name: string;
    russian: string;
    image: CalendarAnimeImage;
    url: string;
    kind: string;
    score: string;
    status: string;
    episodes: number;
    episodesAired: number;
    airedOn: string;
    releasedOn: string;
}

interface CalendarAnimeImage {
    original: string;
    preview: string;
}

export const defaultCalendarAnimeValues: CalendarAnimeItem = {
    nextEpisode: 0,
    nextEpisodeAt: "",
    duration: 0,
    anime: {
        id: 0,
        name: "",
        russian: "",
        image: {
            original: "",
            preview: "",
        },
        url: "",
        kind: "",
        score: "",
        status: "",
        episodes: 0,
        episodesAired: 0,
        airedOn: "",
        releasedOn: "",
    },
    //  дефолтные значения для полей CalendarAnimeItem
};
