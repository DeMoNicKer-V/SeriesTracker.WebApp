"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/animes"); // Перенаправление на гланую страницу
    }, []);

    return null; // Можно вернуть пустой компонент
}
