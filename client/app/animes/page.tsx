"use client";
import AnimeList from "../components/Animes/AnimeList";

// Основной компонент AnimesPage: Главная страница сайт
export default function AnimesPage() {
    return (
        <div className="container">
            <title>Series Tracker - Аниме</title>
            <AnimeList />
        </div>
    );
}
