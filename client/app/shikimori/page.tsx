"use client";
import AnimeList from "../components/Animes/AnimeList";
export default function MainPage() {
    return (
        <div
            className="container"
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <title>Series Tracker - Аниме</title>
            <AnimeList />
        </div>
    );
}
