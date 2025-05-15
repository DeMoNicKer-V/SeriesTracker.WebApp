import { get } from "@/app/api/httpClient";
import {
    Anime,
    defaultAnimeValues as defaultValues,
} from "@/app/models/anime/Anime";
import useAnimeList from "@/app/utils/useAnimeList";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { ConfigProvider, FloatButton, List } from "antd";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import EmptyView from "../EmptyView";
import PageNavigator from "../PageNavigator";
import AnimeItem from "./AnimeItem";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента UserAnimesList
interface Props {
    myList: string; // Тип списка аниме
    userName: string; // Имя пользователя, для которого отображается список (обязательно)
    color?: string; // Цвет для стилизации (необязательно)
}

/**
 * @component UserAnimesList
 * @description Компонент для отображения списка аниме конкретного пользователя.
 * Использует хук useAnimeList для управления пагинацией и useSWR для получения данных.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const UserAnimesList: React.FC<Props> = ({
    myList,
    userName,
    color,
}: Props): JSX.Element => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false); // Состояние для фильтрации по избранному

    const { page, createQueryString, changePage } = useAnimeList();

    // Переключает состояние фильтрации по избранному.
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    //  Асинхронная функция для получения аниме по Url.
    const getAnimesList = async (url: string) => {
        const data: Anime[] = await get(url);
        return data;
    };

    // Сбрасывает номер текущей страницы на 1.
    const resetPage = useCallback(() => {
        changePage(1);
    }, [changePage, myList]);

    useEffect(() => {
        resetPage();
    }, [resetPage]);

    //  Используем хук useSWR для получения данных об аниме
    const {
        data = Array.from({ length: 14 }).map((_, i) => defaultValues),
        isLoading,
    } = useSWR(
        () => {
            //  Функция для генерации URL
            return `/series/${userName}/list/${page}?${createQueryString({
                myList,
                isFavorite,
            })}`;
        },
        getAnimesList,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 0,
        }
    );

    // Компонент для отображения скелетона и навигации по страницам.
    const ListBranches = ({ hidden }: any) => {
        return (
            <PageNavigator
                hidden={hidden}
                nextButtonnDisabled={data.length < 21}
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
            theme={{
                components: color
                    ? {
                          FloatButton: {
                              colorPrimary: color,
                              colorPrimaryHover: color,
                              colorFillContent: color,
                          },
                          Tooltip: {
                              colorBgSpotlight: color,
                          },
                          Button: {
                              colorPrimaryHover: color,
                          },
                      }
                    : {},
            }}
            renderEmpty={() => (
                <EmptyView text="По вашему запросу ничего не найдено" />
            )}
        >
            <List
                className={styles["animes-list"]}
                header={<ListBranches hidden={false} />}
                footer={<ListBranches hidden={data.length < 21} />}
                grid={{
                    gutter: 30,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data}
                renderItem={(anime: Anime) => (
                    <List.Item key={anime.id}>
                        <AnimeItem
                            anime={anime}
                            loading={isLoading}
                            color={color}
                        />
                    </List.Item>
                )}
            />

            <FloatButton.Group className={styles["float-btn-group"]}>
                <FloatButton
                    aria-label={"Отобразить избранное"}
                    tooltip="Только избранное"
                    type={isFavorite ? "primary" : "default"}
                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleFavorite}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </ConfigProvider>
    );
};

export default UserAnimesList;
