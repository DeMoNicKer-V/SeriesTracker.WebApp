"use client";
import {
    Button,
    Card,
    Col,
    Image,
    Flex,
    Row,
    Typography,
    FloatButton,
    Collapse,
    Space,
    MenuProps,
    Dropdown,
    InputNumber,
    Rate,
    ConfigProvider,
    InputNumberProps,
} from "antd";
import { useState } from "react";
import Meta from "antd/es/card/Meta";
import { getAnimeById } from "@/app/services/shikimori";
import AbsoluteImage from "@/app/components/AbsoluteImage";
import {
    StarOutlined,
    HeartFilled,
    CalendarOutlined,
    DownOutlined,
    ClockCircleOutlined,
    BookOutlined,
    TeamOutlined,
    FireOutlined,
    YoutubeOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    MinusOutlined,
} from "@ant-design/icons";
import {
    createSeries,
    deleteSeries,
    updateSeries,
} from "@/app/services/series";
import Link from "next/link";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import noFoundImage from ".//..//../img/img-error.jpg";
import { IsAuth } from "@/app/api/coockie";
import Relatedanimes from "@/app/components/RelatedAnimes/RelatedAnimes";
import styles from "./page.module.css";
import InfoDescription from "@/app/components/AnimeDetailDescription/InfoDescription";
import GenreDescription from "@/app/components/AnimeDetailDescription/GenreDescription";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import Loading from "@/app/components/Loading";
import { Anime, defaultValues } from "@/app/Models/Anime/Anime";
import useSWR from "swr";

const { Title, Text } = Typography;

export default function AnimePage({ params }: { params: { id: string } }) {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [categories, setCategories] = useState<MenuProps["items"]>([]);
    const [watchedEpisode, setWatchedEpisode] = useState<number>(0);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const defaultCategories = [
        { id: 1, name: "Запланировано" },
        { id: 2, name: "Смотрю" },
        { id: 3, name: "Просмотрено" },
        { id: 4, name: "Пересматриваю" },
        { id: 5, name: "Отложено" },
        { id: 6, name: "Брошено" },
    ] as Category[];

    const getAnime = async (id: string) => {
        const response = await getAnimeById(id);
        checkAuth();
        setWatchedEpisode(
            response.watchedEpisodes === null ? 0 : response.watchedEpisodes
        );
        setIsFavorite(
            response.isFavorite === null ? false : response.isFavorite
        );
        getCategories(response);
        return response;
    };

    const { data: anime = defaultValues, isLoading } = useSWR<Anime>(
        params.id,
        getAnime,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const getCategories = async (info: Anime) => {
        const array: MenuProps["items"] = [];
        defaultCategories.forEach((element: { id: number; name: string }) => {
            if (element.id === info.categoryId) {
                array.push(
                    {
                        type: "divider",
                    },
                    {
                        key: -1,
                        label: "Удалить из списка",
                        danger: true,
                        onClick: async () => deleteFromMylist(info.seriesId),
                    }
                );
            } else {
                array.unshift({
                    key: element.id,
                    label: element.name,
                    onClick: async () => {
                        const newCategory = {
                            id: element.id,
                            name: element.name,
                        } as Category;
                        await updateCategorySeries(info, newCategory);
                    },
                });
            }
        });

        setCategories(array);
    };
    const checkAuth = async () => {
        setIsAuth(await IsAuth());
    };

    const updateFavoriteSeries = async (value: number) => {
        if (anime.seriesId) {
            const request = createRequest(
                anime.watchedEpisodes,
                anime.categoryId,
                !anime.isFavorite
            );
            setIsFavorite(Boolean(value));
            await updateSeries(anime.seriesId, request, false);
            return;
        }
        const request = createRequest(0, 1, true);
        await createSeries(request);
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
            animeId: Number(params.id),
            watchedEpisode: watchedEpisode,
            categoryId: categoryId,
            isFavorite: isFavorite,
        };
        return request;
    };

    const updateCategorySeries = async (anime: Anime, category: Category) => {
        if (anime.seriesId) {
            const request = createRequest(
                category.id === 3 ? anime.episodes : anime.watchedEpisodes,
                category.id,
                anime.isFavorite
            );
            await updateSeries(anime.seriesId, request, true);
        } else {
            const request = createRequest(
                category.id === 3 ? anime.episodes : 0,
                category.id
            );
            await createSeries(request);
        }
    };

    const deleteFromMylist = async (id: string) => {
        await deleteSeries(id);
    };

    const AddToMyList = async () => {
        if (anime.seriesId !== null) {
            return;
        }
        const request = createRequest();
        await createSeries(request);
    };

    const items: MenuProps["items"] = categories;

    return isLoading ? (
        <Loading loading />
    ) : (
        <div className="container">
            <title>{`Series Tracker - ${anime.subTitle}`}</title>

            <ConfigProvider
                theme={{
                    components: {
                        Divider: {
                            verticalMarginInline: 0,
                        },
                        Typography: {
                            fontSize: 17,
                            titleMarginBottom: 0,
                        },
                        Collapse: {
                            colorBorder: "transparent",
                        },
                    },
                }}
            >
                <Row align={"middle"} justify={"center"}>
                    <Col xxl={19} md={21}>
                        <Card style={{ opacity: 0.9, padding: 0 }}>
                            <Flex style={{ zIndex: 0, position: "relative" }}>
                                <AbsoluteImage
                                    src={anime.pictureUrl}
                                    zIndex={-1}
                                    filter="contrast(175%) brightness(75%)"
                                />

                                <Link href={"./"}>
                                    <Button
                                        type="primary"
                                        icon={<LongLeftArrow />}
                                        style={{
                                            margin: 20,
                                            position: "absolute",
                                        }}
                                    ></Button>
                                </Link>
                                <div id={styles["overlay-background"]}>
                                    <Row
                                        gutter={[5, 5]}
                                        className={styles["anime-detail-row"]}
                                        align={"bottom"}
                                        justify={"center"}
                                    >
                                        <Col lg={24} xl={6} xxl={5}>
                                            <Flex justify="center">
                                                <Image
                                                    style={{
                                                        maxHeight: "380px",
                                                        pointerEvents: "none",
                                                    }}
                                                    preview={false}
                                                    src={anime.pictureUrl}
                                                    fallback={noFoundImage.src}
                                                />
                                            </Flex>
                                        </Col>
                                        <Col
                                            xs={24}
                                            sm={24}
                                            lg={24}
                                            md={24}
                                            xl={18}
                                            xxl={19}
                                        >
                                            <Flex
                                                className={
                                                    styles["flex-anime-detail"]
                                                }
                                            >
                                                <Meta
                                                    className={
                                                        styles[
                                                            "anime-detail-title"
                                                        ]
                                                    }
                                                    title={
                                                        <Title level={3}>
                                                            {anime.title}
                                                        </Title>
                                                    }
                                                    description={
                                                        <Text
                                                            italic
                                                            type="secondary"
                                                        >
                                                            {anime.subTitle}
                                                        </Text>
                                                    }
                                                />
                                                <GenreDescription
                                                    genresString={anime.genres}
                                                />
                                                <InfoDescription
                                                    items={[
                                                        {
                                                            text: anime.kind,
                                                            icon: (
                                                                <InfoCircleOutlined />
                                                            ),
                                                        },
                                                        {
                                                            text: anime.rating,
                                                            icon: (
                                                                <TeamOutlined />
                                                            ),
                                                        },
                                                        {
                                                            text: anime.status,
                                                            icon: (
                                                                <FireOutlined />
                                                            ),
                                                        },

                                                        {
                                                            text: anime.startDate
                                                                ? new Date(
                                                                      anime.startDate
                                                                  ).toLocaleString(
                                                                      "ru-Ru",
                                                                      {
                                                                          year: "numeric",
                                                                          month: "short",
                                                                          day: "numeric",
                                                                      }
                                                                  )
                                                                : "Неизвестно",
                                                            icon: (
                                                                <CalendarOutlined />
                                                            ),
                                                        },
                                                        {
                                                            text: `${anime.episodes} эп.`,
                                                            icon: (
                                                                <YoutubeOutlined />
                                                            ),
                                                        },
                                                        {
                                                            text: `${anime.duration} мин.`,
                                                            icon: (
                                                                <ClockCircleOutlined />
                                                            ),
                                                        },
                                                        {
                                                            text: `${anime.score} из 10`,
                                                            icon: (
                                                                <StarOutlined />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                                {isAuth ? (
                                                    <Space
                                                        wrap
                                                        className="space-buttons"
                                                        style={{
                                                            cursor: "default",
                                                        }}
                                                    >
                                                        <Rate
                                                            tooltips={[
                                                                isFavorite
                                                                    ? "Удалить из избранного"
                                                                    : "Добавить в избранное",
                                                            ]}
                                                            character={
                                                                <HeartFilled />
                                                            }
                                                            style={{
                                                                color: "#ff69b4",
                                                            }}
                                                            onChange={
                                                                updateFavoriteSeries
                                                            }
                                                            defaultValue={
                                                                isFavorite
                                                                    ? 1
                                                                    : 0
                                                            }
                                                            count={1}
                                                        />

                                                        <Dropdown.Button
                                                            size="small"
                                                            menu={{ items }}
                                                            icon={
                                                                <DownOutlined />
                                                            }
                                                            prefixCls="aaa"
                                                            className="manage-button"
                                                            onClick={
                                                                AddToMyList
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                whiteSpace:
                                                                    "break-spaces",
                                                                height: "auto",
                                                                borderRadius: 5,
                                                            }}
                                                        >
                                                            {!anime.seriesId ? (
                                                                <Flex gap={5}>
                                                                    <PlusOutlined />
                                                                    {
                                                                        "Добавить в мой список"
                                                                    }
                                                                </Flex>
                                                            ) : (
                                                                <Flex
                                                                    style={{
                                                                        color: anime.categoryColor,
                                                                    }}
                                                                    gap={5}
                                                                >
                                                                    <BookOutlined />
                                                                    {
                                                                        anime.categoryName
                                                                    }
                                                                </Flex>
                                                            )}
                                                        </Dropdown.Button>

                                                        {anime.seriesId && (
                                                            <InputNumber
                                                                readOnly={
                                                                    anime.categoryId ===
                                                                    3
                                                                }
                                                                value={
                                                                    watchedEpisode
                                                                }
                                                                onChange={
                                                                    onEpisodeInputChange
                                                                }
                                                                size="small"
                                                                maxLength={4}
                                                                addonBefore={
                                                                    <Button
                                                                        disabled={
                                                                            anime.categoryId ===
                                                                            3
                                                                        }
                                                                        type="link"
                                                                        size="small"
                                                                        icon={
                                                                            <MinusOutlined />
                                                                        }
                                                                        onClick={
                                                                            decEpisodeSeries
                                                                        }
                                                                    ></Button>
                                                                }
                                                                addonAfter={
                                                                    <Button
                                                                        disabled={
                                                                            anime.categoryId ===
                                                                            3
                                                                        }
                                                                        type="link"
                                                                        size="small"
                                                                        icon={
                                                                            <PlusOutlined />
                                                                        }
                                                                        onClick={
                                                                            incEpisodeSeries
                                                                        }
                                                                    ></Button>
                                                                }
                                                                style={{
                                                                    width: "auto",
                                                                }}
                                                                max={
                                                                    anime.episodes
                                                                }
                                                                prefix={
                                                                    "Эпизоды:"
                                                                }
                                                                suffix={`из ${anime.episodes} эп.`}
                                                                min={0}
                                                                variant="filled"
                                                                step={1}
                                                                controls={false}
                                                            />
                                                        )}
                                                    </Space>
                                                ) : (
                                                    <Button
                                                        ghost
                                                        type="primary"
                                                        href="/login"
                                                    >
                                                        Войдите, чтобы добавить
                                                        в свой список
                                                    </Button>
                                                )}
                                            </Flex>
                                        </Col>
                                    </Row>
                                </div>
                            </Flex>
                            <Meta
                                style={{ padding: 24 }}
                                title={<Title level={3}>Описание</Title>}
                                description={
                                    anime.description
                                        ? anime.description
                                        : "Описание отсутствует"
                                }
                            />
                            <Collapse
                                items={[
                                    ...(anime.screenshots.length > 0
                                        ? [
                                              {
                                                  key: "1",
                                                  label: "Посмотреть кадры",
                                                  children: (
                                                      <ScreenshotsPreview
                                                          screenshots={anime.screenshots.slice(
                                                              0,
                                                              4
                                                          )}
                                                          id={Number(params.id)}
                                                      />
                                                  ),
                                              },
                                          ]
                                        : []),

                                    ...(anime.relateds.length > 0
                                        ? [
                                              {
                                                  key: "2",
                                                  label: "Связанное с этим аниме",
                                                  children: (
                                                      <Relatedanimes
                                                          animes={
                                                              anime.relateds
                                                          }
                                                      />
                                                  ),
                                              },
                                          ]
                                        : []),
                                ]}
                                bordered={false}
                                style={{ margin: 24 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </ConfigProvider>

            <FloatButton.BackTop style={{ right: 24 }} />
        </div>
    );
}
