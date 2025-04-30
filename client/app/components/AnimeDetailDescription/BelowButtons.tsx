import {
    Button,
    Divider,
    Flex,
    InputNumber,
    InputNumberProps,
    Rate,
    Select,
    Space,
    Tag,
} from "antd";
import React, { useState } from "react";
import {
    StarOutlined,
    HeartFilled,
    CalendarOutlined,
    ClockCircleOutlined,
    BookOutlined,
    TeamOutlined,
    FireOutlined,
    YoutubeOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    MinusOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import styles from "./component.module.css";
import { Anime } from "@/app/Models/Anime/Anime";
import { createSeries } from "@/app/api/series/createSeries";
import { deleteSeries } from "@/app/api/series/deleteSeries";
import { updateSeries } from "@/app/api/series/editSeries";
import { mutate } from "swr";
interface Props {
    anime: Anime;
}

const BelowButtons = ({ anime }: Props) => {
    const [filteredCategories, setFilteredCategories] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);
    const [watchedEpisode, setWatchedEpisode] = useState<number>(0);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const updateFavoriteSeries = async (value: number) => {
        if (anime.seriesId) {
            const request = createRequest(
                anime.watchedEpisodes,
                anime.categoryId,
                !anime.isFavorite
            );
            setIsFavorite(Boolean(value));
            await updateSeries(anime.seriesId, request);
            return;
        }
        const request = createRequest(0, 1, true);
        await createSeries(request);

        mutate(anime.id.toString());
    };

    const updateEpisodeSeries = async (episodeValue: number) => {
        const request = createRequest(
            episodeValue,
            anime.categoryId,
            anime.isFavorite
        );
        await updateSeries(anime.seriesId, request);
    };
    const onEpisodeInputChange: InputNumberProps["onChange"] = (value) => {
        if (value === null) {
            return;
        }
        setWatchedEpisode(Number(value));
        updateEpisodeSeries(Number(value));
    };

    const decEpisodeSeries = async () => {
        if (watchedEpisode === 0) {
            return;
        }
        const newValue = watchedEpisode - 1;
        setWatchedEpisode(newValue);
        updateEpisodeSeries(newValue);
    };

    const incEpisodeSeries = async () => {
        if (watchedEpisode === anime.episodes) {
            return;
        }
        const newValue = watchedEpisode + 1;
        setWatchedEpisode(newValue);
        updateEpisodeSeries(newValue);
    };

    const createRequest = (
        watchedEpisode = 0,
        categoryId = 1,
        isFavorite = false
    ) => {
        const request = {
            animeId: anime.id,
            watchedEpisode: watchedEpisode,
            categoryId: categoryId,
            isFavorite: isFavorite,
        };
        return request;
    };

    const updateCategorySeries = async (anime: Anime, categoryId: number) => {
        if (anime.seriesId) {
            const request = createRequest(
                categoryId === 3 ? anime.episodes : anime.watchedEpisodes,
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
    };

    const deleteSeriesById = async (seriesId: string) => {
        await deleteSeries(seriesId);
        mutate(anime.id.toString());
    };

    return (
        <Space
            wrap
            className={styles["manage-buttons"]}
            style={{
                cursor: "default",
            }}
        >
            <Rate
                tooltips={[
                    anime.isFavorite
                        ? "Удалить из избранного"
                        : "Добавить в избранное",
                ]}
                character={<HeartFilled />}
                style={{
                    color: "#ff69b4",
                }}
                onChange={updateFavoriteSeries}
                defaultValue={anime.isFavorite ? 1 : 0}
                count={1}
            />

            <Select
                onChange={(value: string) =>
                    updateCategorySeries(anime, Number(value))
                }
                rootClassName={styles["selector"]}
                size="small"
                style={{
                    width: 240,
                    textAlign: "start",
                }}
                defaultActiveFirstOption={false}
                prefix={<BookOutlined />}
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
                        <Divider
                            style={{
                                marginBlock: 10,
                            }}
                        />

                        {anime.seriesId && (
                            <Button
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                className="width-100"
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
                options={filteredCategories}
            />

            {anime.seriesId && (
                <InputNumber
                    className={styles["episodes-input"]}
                    readOnly={anime.categoryId === 3}
                    value={watchedEpisode}
                    onChange={onEpisodeInputChange}
                    size="small"
                    maxLength={4}
                    addonBefore={
                        <Button
                            disabled={anime.categoryId === 3}
                            type="link"
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={decEpisodeSeries}
                        ></Button>
                    }
                    addonAfter={
                        <Button
                            disabled={anime.categoryId === 3}
                            type="link"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={incEpisodeSeries}
                        ></Button>
                    }
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
    );
};
export default BelowButtons;
