// AnimeDataProvider.tsx
import { Anime, defaultAnimeValues } from "@/app/models/anime/Anime"; // Импортируем типы данных и дефолтное значение
import React from "react";
import useSWR from "swr";
import { getAnimeById } from "../api/animes/getAnime";
import PageErrorView from "./PageErrorVIew";

// Интерфейс для props компонента AnimeDataProvider
interface AnimeDataProviderProps {
    animeId: string; // ID аниме, данные о котором нужно получить
    children: (props: {
        anime: Anime;
        isLoading: boolean;
        error: any;
    }) => React.ReactNode;
    // Функция, принимающая объект с данными аниме, состоянием загрузки и ошибкой в качестве аргументов.
    // Эта функция используется для рендеринга контента, который зависит от данных аниме.
    // React.ReactNode - тип, представляющий собой любой валидный элемент React (компоненты, текст и т.д.)
}

// Компонент AnimeDataProvider: Предоставляет данные об аниме и обрабатывает состояния загрузки и ошибок
const AnimeDataProvider: React.FC<AnimeDataProviderProps> = ({
    animeId,
    children,
}) => {
    // Используем useSWR для получения данных об аниме.
    const {
        data: anime = defaultAnimeValues,
        isLoading,
        error,
    } = useSWR<Anime>(
        animeId, // Ключ для запроса: ID аниме
        (id) => getAnimeById(id), // Функция для получения данных: getAnimeById с ID
        {
            revalidateOnFocus: false, // Отключаем перепроверку при фокусе окна
            revalidateOnReconnect: false, // Отключаем перепроверку при переподключении к сети
            errorRetryCount: 0, // Отключаем автоматические повторные попытки загрузки при ошибке
        }
    );

    // Обрабатываем ошибки: если произошла ошибка, отображаем компонент PageErrorView
    if (error) {
        return <PageErrorView text={error.message} />;
    }

    // Возвращаем children (дочерние элементы) с данными аниме, состоянием загрузки и ошибкой.
    return children({ anime, isLoading, error });
};

export default AnimeDataProvider;
