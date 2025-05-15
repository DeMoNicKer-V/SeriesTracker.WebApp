import { getAnimes } from "@/app/api/animes/getAnime";
import { Anime, defaultAnimeValues } from "@/app/models/anime/Anime";
import useAnimeList from "@/app/utils/useAnimeList";
import { SearchOutlined } from "@ant-design/icons";
import { ConfigProvider, FloatButton, List } from "antd";
import React, { useState } from "react";
import useSWR from "swr";
import AnimeFilterForm from "../AnimeFilterForm";
import EmptyView from "../EmptyView";
import PageNavigator from "../PageNavigator";
import AnimeItem from "./AnimeItem";
import styles from "./component.module.css";

/**
 * @component AnimeList
 * @description Компонент для отображения списка аниме на главной странице.
 * Использует хук useAnimeList для управления пагинацией и useSWR для получения данных.
 * @returns {JSX.Element}
 */
const AnimesList: React.FC = ({}): JSX.Element => {
    // Хук для управления пагинацией
    const { page, request, setRequest, createQueryString, changePage } =
        useAnimeList();

    // Состояние, отвечающее за открытие меню поиска
    const [isOpen, setIsOpen] = useState(false);

    // Функция для переключения состояния видимости меню поиска
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    //  Асинхронная функция для получения аниме по Url.
    const getAnimesList = async (url: string): Promise<Anime[]> => {
        const data: Anime[] = await getAnimes(url);
        return data;
    };

    // Используем хук для получения аниме
    const {
        data = Array.from({ length: 14 }).map((_, i) => defaultAnimeValues),
        isLoading,
    } = useSWR(createQueryString(request), getAnimesList, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 0,
    });

    // Компонент для отображения скелетона и навигации по страницам.
    const ListBranches = () => {
        return (
            <PageNavigator
                hidden={(data.length < 22 && page == 1) || data.length < 22}
                isLoading={isLoading}
                onFirstButtonCLick={() => changePage(1)}
                onPrevButtonCLick={() => changePage(page - 1)}
                onNextButtonCLick={() => changePage(page + 1)}
                page={page}
            />
        );
    };

    return (
        <ConfigProvider
            renderEmpty={() => (
                <EmptyView text="По вашему запросу ничего не найдено" />
            )}
        >
            <List
                className={styles["animes-list"]}
                header={<ListBranches />}
                footer={<ListBranches />}
                grid={{
                    gutter: 30,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data.length === 22 ? data.slice(0, -1) : data}
                renderItem={(anime: Anime) => (
                    <List.Item>
                        <AnimeItem anime={anime} loading={isLoading} />
                    </List.Item>
                )}
            />
            <AnimeFilterForm
                open={isOpen}
                onClose={toggleOpen}
                setRequest={setRequest}
                setPage={changePage}
            />
            <FloatButton.Group className={styles["float-btn-group"]}>
                <FloatButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={toggleOpen}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </ConfigProvider>
    );
};

export default AnimesList;
