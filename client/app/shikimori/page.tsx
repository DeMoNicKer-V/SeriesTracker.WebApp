"use client";
import { Animes } from "../components/Animes";
import { Typography } from "antd";
export default function MainPage() {
    return (
        <div className="container">
            <title>Series Tracker - Аниме</title>

            <Animes />
        </div>
    );
}
