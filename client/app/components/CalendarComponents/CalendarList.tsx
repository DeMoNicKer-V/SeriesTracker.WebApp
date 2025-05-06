// CalendarList.tsx
import {
    CalendarAnimeItem,
    defaultCalendarAnimeValues,
} from "@/app/models/anime/CalendarAnimeItem";
import { ConfigProvider, List } from "antd";
import React, { useMemo } from "react";
import { EmptyView } from "../EmptyView";
import CalendarAnime from "./CalendarAnime";
import styles from "./component.module.css";

// Интерфейс для props компонента CalendarList
interface Props {
    animes: CalendarAnimeItem[]; // Массив аниме для отображения в списке
    loading: boolean; // Флаг, указывающий, загружаются ли данные
}

/**
 * @component CalendarList
 * @description Компонент для отображения списка аниме.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const CalendarList: React.FC<Props> = ({
    animes,
    loading,
}: Props): JSX.Element => {
    // Создаем массив элементов для отображения Skeleton при загрузке
    const renderItemsLoading = useMemo(() => {
        // Мемоизируем для оптимизации
        return Array(5) // Создаем массив из 5 элементов
            .fill(defaultCalendarAnimeValues) // Заполняем его defaultCalendarAnimeValues
            .map(
                (
                    item: CalendarAnimeItem,
                    index // Преобразуем каждый элемент в List.Item
                ) => (
                    <List.Item
                        key={`loading-${index}`}
                        style={{ border: "none" }}
                    >
                        <CalendarAnime item={item} loading={loading} />
                    </List.Item>
                )
            );
    }, [loading]);

    // Мемоизированный массив элементов для отображения реальных данных
    const renderItems = useMemo(() => {
        return animes.map((item: CalendarAnimeItem) => (
            <List.Item key={item.anime.id} className={styles["calendar-item"]}>
                <CalendarAnime item={item} loading={loading} />
            </List.Item>
        )); // Преобразуем каждый элемент animes в List.Item
    }, [animes]); // Зависимости: animes (если animes меняется, пересоздаем массив)

    return (
        <ConfigProvider
            renderEmpty={() => (
                <EmptyView text="На данную дату релизов не найдено..." />
            )}
        >
            <List
                dataSource={loading ? renderItemsLoading : renderItems}
                renderItem={(item) => item}
            />
        </ConfigProvider>
    );
};

export default CalendarList;
