"use client";
import { useEffect, useState } from "react";
import { Animes } from "../components/Animes";
import { getAnimes } from "../services/shikimori";

export default function ShikimoriPage() {
    const [animes, setAnimes] = useState<Anime[] | any>([]);

    const getSeries = async (page: number) => {
        const animes = await getAnimes(page);
        setAnimes(animes);
    };
    useEffect(() => {
        getSeries(1);
    }, []);
    return <Animes animes={animes} />;
}
