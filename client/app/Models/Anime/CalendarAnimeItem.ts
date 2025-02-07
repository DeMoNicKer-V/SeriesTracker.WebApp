export interface CalendarAnimeItem {
    next_episode: number;
    next_episode_at: string;
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
    episodes_aired: number;
    aired_on: string;
    released_on: string;
}

interface CalendarAnimeImage {
    original: string;
    preview: string;
}

export const defaultValues: CalendarAnimeItem = {
    next_episode: 0,
    next_episode_at: "",
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
        episodes_aired: 0,
        aired_on: "",
        released_on: "",
    },
    //  дефолтные значения для полей CalendarAnimeItem
};
