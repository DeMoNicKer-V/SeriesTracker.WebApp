import { createSeries } from "@/app/api/series/createSeries";
import { deleteSeries } from "@/app/api/series/deleteSeries";
import { updateSeries } from "@/app/api/series/editSeries";
import { AnimeDetail } from "@/app/models/anime/AnimeDetail";
import {
    BookOutlined,
    CloseOutlined,
    HeartFilled,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Divider,
    Flex,
    InputNumber,
    InputNumberProps,
    message,
    Rate,
    Select,
    SelectProps,
    Space,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { mutate } from "swr";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента BelowButtons
interface Props {
    anime: AnimeDetail; // Детали аниме (обязательно)
    auth: boolean; // Определяет, авторизован ли пользователь (обязательно)
    categories: { value: number; label: string }[]; // Список категорий (обязательно)
}

/**
 * @component BelowButtons
 * @description Компонент для отображения кнопок управления аниме пользователя.
 * Позволяет добавлять/удалять из избранного, изменять количество просмотренных эпизодов и категорию.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const BelowButtons: React.FC<Props> = ({
    anime,
    categories,
    auth,
}: Props): JSX.Element => {
    // Состояние для хранения количества просмотренных эпизодов
    const [watchedEpisode, setWatchedEpisode] = useState<number>(
        anime.watchedEpisodes
    );

    // Создает объект запроса для обновления данных о просмотре аниме.
    const createRequest = useCallback(
        (
            watchedEpisode: number = 0,
            categoryId: number = 1,
            isFavorite: boolean = false
        ) => {
            const request = {
                animeId: anime.id,
                watchedEpisode: watchedEpisode,
                categoryId: categoryId,
                isFavorite: isFavorite,
            };
            return request;
        },
        [anime]
    );

    // Добавляет/удаляет аниме из избранного.
    const updateFavoriteSeries = useCallback(async () => {
        try {
            if (anime.seriesId) {
                const request = createRequest(
                    anime.watchedEpisodes,
                    anime.categoryId,
                    !anime.isFavorite
                );
                await updateSeries(anime.seriesId, request);
            } else {
                const request = createRequest(0, 1, true);
                await createSeries(request);
            }
            mutate(anime.id.toString());
        } catch (error) {
            console.error("Ошибка при обновлении избранного:", error);
            message.error("Не удалось обновить избранное.");
        }
    }, [anime, createRequest]);

    // Обновляет количество просмотренных эпизодов аниме..
    const updateEpisodeSeries = useCallback(
        async (episodeValue: number) => {
            try {
                const request = createRequest(
                    episodeValue,
                    anime.categoryId,
                    anime.isFavorite
                );
                await updateSeries(anime.seriesId, request);
            } catch (error) {
                console.error("Ошибка при обновлении эпизодов:", error);
                message.error("Не удалось обновить количество эпизодов.");
            }
        },
        [anime, createRequest]
    );

    // Обработчик изменения значения в поле ввода количества просмотренных эпизодов.
    const onEpisodeInputChange: InputNumberProps["onChange"] = useCallback(
        (value: any) => {
            const newEpisodeValue = Number(value);
            setWatchedEpisode(newEpisodeValue);
            updateEpisodeSeries(newEpisodeValue);
        },
        [updateEpisodeSeries]
    );

    // Уменьшает количество просмотренных эпизодов на 1.
    const decEpisodeSeries = useCallback(async () => {
        if (watchedEpisode === 0) {
            return;
        }
        try {
            const newValue = watchedEpisode - 1;
            setWatchedEpisode(newValue);
            updateEpisodeSeries(newValue);
        } catch (error) {
            console.error("Ошибка при уменьшении эпизода:", error);
            message.error("Не удалось уменьшить количество эпизодов.");
        }
    }, [watchedEpisode, updateEpisodeSeries, anime]);

    // Увеличивает количество просмотренных эпизодов на 1.
    const incEpisodeSeries = useCallback(async () => {
        if (watchedEpisode === anime.episodes) {
            return;
        }
        try {
            const newValue = watchedEpisode + 1;
            setWatchedEpisode(newValue);
            updateEpisodeSeries(newValue);
        } catch (error) {
            console.error("Ошибка при увеличении эпизода:", error);
            message.error("Не удалось увеличить количество эпизодов.");
        }
    }, [watchedEpisode, updateEpisodeSeries, anime]);

    // Обновляет категорию аниме.
    const updateCategorySeries = useCallback(
        async (anime: AnimeDetail, categoryId: number) => {
            try {
                let newWatchedEpisode = anime.watchedEpisodes;
                if (categoryId === 3) {
                    newWatchedEpisode = anime.episodes;
                    setWatchedEpisode(anime.episodes);
                }
                if (anime.seriesId) {
                    const request = createRequest(
                        categoryId === 3
                            ? anime.episodes
                            : anime.watchedEpisodes,
                        categoryId,
                        anime.isFavorite
                    );
                    await updateSeries(anime.seriesId, request);
                } else {
                    const request = createRequest(
                        categoryId === 3 ? anime.episodes : 0,
                        categoryId
                    );
                    await createSeries(request);
                }
                mutate(anime.id.toString());
            } catch (error) {
                console.error("Ошибка при обновлении категории:", error);
                message.error("Не удалось обновить категорию.");
            }
        },
        [anime, createRequest]
    );

    // Удаляет аниме из списка пользователя.
    const deleteSeriesById = useCallback(
        async (seriesId: string) => {
            try {
                await deleteSeries(seriesId);
                mutate(anime.id.toString());
            } catch (error) {
                console.error("Ошибка при удалении аниме:", error);
                message.error("Не удалось удалить аниме из вашего списка.");
            }
        },
        [anime]
    );

    // Список мемоизированных категорий
    const categoryOptions: SelectProps["options"] = useMemo(() => {
        return categories.map((category) => ({
            value: category.value,
            label: category.label,
        }));
    }, [categories]);

    // Обработчик изменения категории
    const onChange: SelectProps["onChange"] = useCallback(
        (value: number) => {
            updateCategorySeries(anime, value);
        },
        [anime, updateCategorySeries]
    );

    return auth ? (
        <Space wrap className={styles["manage-buttons"]}>
            <Rate
                tooltips={[
                    anime.isFavorite
                        ? "Удалить из избранного"
                        : "Добавить в избранное",
                ]}
                character={<HeartFilled />}
                className={styles["heart-icon"]}
                onChange={updateFavoriteSeries}
                defaultValue={anime.isFavorite ? 1 : 0}
                count={1}
            />

            <Select
                onChange={onChange}
                className={styles["category-select"]}
                rootClassName={styles["selector"]}
                size="small"
                defaultActiveFirstOption={false}
                prefix={<BookOutlined style={{ color: anime.categoryColor }} />}
                value={anime.categoryName}
                placement="topLeft"
                placeholder={
                    <Flex gap={5}>
                        <PlusOutlined />
                        {"Добавить в мой список"}
                    </Flex>
                }
                dropdownRender={(menu: any) => (
                    <>
                        {menu}
                        <Divider className={styles["selector-divider"]} />
                        {anime.seriesId && (
                            <Button
                                className={styles["delete-anime-btn"]}
                                size="small"
                                danger
                                type="link"
                                icon={<CloseOutlined />}
                                onClick={() => deleteSeriesById(anime.seriesId)}
                            >
                                Удалить из списка
                            </Button>
                        )}
                    </>
                )}
                options={categoryOptions}
            />

            {anime.seriesId && (
                <InputNumber
                    className={styles["episodes-input"]}
                    readOnly={anime.categoryId === 3}
                    onChange={onEpisodeInputChange}
                    size="small"
                    maxLength={4}
                    addonBefore={
                        <Button
                            disabled={anime.categoryId === 3}
                            onClick={decEpisodeSeries}
                            type="link"
                            size="small"
                            icon={<MinusOutlined />}
                        ></Button>
                    }
                    addonAfter={
                        <Button
                            disabled={anime.categoryId === 3}
                            onClick={incEpisodeSeries}
                            type="link"
                            size="small"
                            icon={<PlusOutlined />}
                        ></Button>
                    }
                    value={watchedEpisode}
                    max={anime.episodes}
                    prefix={"Эпизоды:"}
                    suffix={`из ${anime.episodes} эп.`}
                    min={0}
                    variant="filled"
                    step={1}
                    controls={false}
                />
            )}
        </Space>
    ) : (
        <Button ghost type="primary" href="/login">
            Войдите, чтобы добавить в свой список
        </Button>
    );
};
export default BelowButtons;
