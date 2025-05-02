// CalendarList.tsx
import {
    CalendarAnimeItem,
    defaultCalendarAnimeValues,
} from "@/app/models/anime/CalendarAnimeItem";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, Flex, List, Typography } from "antd";
import React, { useMemo } from "react";
import CalendarAnime from "./CalendarAnime";
const { Text } = Typography;
// Интерфейс для props компонента CalendarList
interface CalendarListProps {
    animes: CalendarAnimeItem[]; // Массив аниме для отображения в списке
    loading: boolean; // Флаг, указывающий, загружаются ли данные
}

// Компонент CalendarList: Отображает список аниме (или Skeleton, если данные загружаются)
const CalendarList: React.FC<CalendarListProps> = ({ animes, loading }) => {
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
            <List.Item key={item.anime.id} style={{ border: "none" }}>
                <CalendarAnime item={item} loading={loading} />
            </List.Item>
        )); // Преобразуем каждый элемент animes в List.Item
    }, [animes]); // Зависимости: animes (если animes меняется, пересоздаем массив)

    return (
        <ConfigProvider
            renderEmpty={() => (
                <Flex
                    className="emptyview"
                    justify="center"
                    align="middle"
                    gap={10}
                >
                    <InfoCircleOutlined style={{ fontSize: 32 }} />
                    <Text style={{ fontSize: 22 }}>
                        {"На данную дату новых релизов не найдено"}
                    </Text>
                </Flex>
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
