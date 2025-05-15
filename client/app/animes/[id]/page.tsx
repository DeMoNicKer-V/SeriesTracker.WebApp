"use client";
import AnimeDataProvider from "@/app/components/AnimeDetail/AnimeDataProvider";
import AnimeDetailsContent from "@/app/components/AnimeDetail/AnimeDetailsContent";
import { useUser } from "@/app/components/UserContext";

// Основной компонент AnimePage: Отображает детальную информацию об аниме
export default function AnimePage({ params }: { params: { id: string } }) {
    // Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    return (
        <AnimeDataProvider animeId={params.id}>
            {({ anime, isLoading, error }) => (
                <AnimeDetailsContent
                    anime={anime}
                    isLoading={isLoading}
                    error={error}
                    user={user}
                />
            )}
        </AnimeDataProvider>
    );
}
