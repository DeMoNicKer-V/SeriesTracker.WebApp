"use client";
import {
    Button,
    Card,
    Col,
    Image,
    Flex,
    Row,
    Tooltip,
    Typography,
    FloatButton,
    Collapse,
    Spin,
    Space,
    MenuProps,
    Dropdown,
    InputNumber,
    Rate,
    ConfigProvider,
} from "antd";
import { useEffect, useState } from "react";
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
    ReadOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    MinusOutlined,
} from "@ant-design/icons";
import {
    createSeries,
    deleteSeriesByAnimeId,
    updateSeries,
} from "@/app/services/series";
import Link from "next/link";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { getCategoryById, getCategoryList } from "@/app/services/category";
import noFoundImage from ".//..//../img/img-error.jpg";
import { IsAuth } from "@/app/api/coockie";
import { LongRightArrow } from "@/app/img/LongRightArrow";
import RelatedAnimes from "@/app/components/RelatedAnimes/RelatedAnimes";
import TextIcon from "@/app/components/TextIcon";

import styles from "./page.module.css";
import InfoDescription from "@/app/components/AnimeDetailDescription/InfoDescription";
import GenreDescription from "@/app/components/AnimeDetailDescription/GenreDescription";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import LinkButton from "@/app/components/LinkButton";
import Loading from "@/app/components/Loading";

export default function AnimePage({ params }: { params: { id: string } }) {
    const defaultValues = {
        animeId: 0,
        watchedEpisode: 0,
        categoryId: 0,
        isFavorite: false,
    } as Series;
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [animes, setAnimes] = useState<Anime | any>();
    const [series, setSeries] = useState<Series | any>(defaultValues);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<MenuProps["items"]>([]);
    const [category, setCategory] = useState<Category | any>();
    const [isSeries, setIsSeries] = useState<boolean>(false);
    const [isFavorite, setisFavorite] = useState<boolean>(false);
    const [watchedEpisode, setWatchedEpisode] = useState<number>(0);
    const getCategories = async (series: Series, animes: Anime) => {
        const categories2 = await getCategoryList();
        const array: MenuProps["items"] = [];
        categories2.forEach((element: { id: number; name: string }) => {
            if (element.id === series.categoryId) {
                array.push({
                    key: -1,
                    label: "Удалить из списка",
                    danger: true,
                    onClick: async () => deleteFromMylist(series.animeId),
                });
            } else {
                array.unshift({
                    key: element.id,
                    label: element.name,
                    onClick: async () => {
                        const newCategory = {
                            id: element.id,
                            name: element.name,
                        } as Category;
                        await updateCategorySeries(series, animes, newCategory);
                    },
                });
            }
        });

        setCategories(array);
    };
    const checkAuth = async () => {
        setIsAuth(await IsAuth());
    };
    const getAnimes = async (id: string) => {
        const response = await getAnimeById(id);
        console.log(response);
        setAnimes(response.anime);

        if (response.series) {
            setSeries(response.series);
            const category = await getCategoryById(response.series.categoryId);
            setCategory(category);
            setIsSeries(true);
            setisFavorite(response.series.isFavorite);
            setWatchedEpisode(response.series.watchedEpisode);
            getCategories(response.series, response.anime);
        } else {
            series.animeId = response.anime.id;
            getCategories(series, response.anime);
        }

        setLoading(false);
    };
    useEffect(() => {
        checkAuth();
        if (params.id) {
            getAnimes(params.id);
        }
    }, []);
    const updateFavoriteSeries = async () => {
        if (isSeries === false) {
            const seriesRequest = {
                animeId: Number(animes.id),
                watchedEpisode: 0,
                categoryId: 1,
                isFavorite: true,
            };
            await createSeries(seriesRequest);

            await getAnimes(params.id);
            return;
        }
        series.isFavorite = !isFavorite;
        setisFavorite(!isFavorite);
        await updateSeries(series.id, series);
    };
    const updateEpisodeSeries = async (value: number) => {
        if (value < 0 || value === null) {
            return;
        }
        setWatchedEpisode(value);
        series.watchedEpisode = value;
        await updateSeries(series.id, series);
    };

    const decEpisodeSeries = async () => {
        if (watchedEpisode === 0) {
            return;
        }
        const newValue = watchedEpisode - 1;
        setWatchedEpisode(newValue);
        series.watchedEpisode = newValue;
        await updateSeries(series.id, series);
    };

    const incEpisodeSeries = async () => {
        if (watchedEpisode === animes.episodes) {
            return;
        }
        const newValue = watchedEpisode + 1;
        setWatchedEpisode(newValue);
        series.watchedEpisode = newValue;
        await updateSeries(series.id, series);
    };

    const updateCategorySeries = async (
        series: Series,
        animes: Anime,
        category: Category
    ) => {
        setCategory(category);
        if (category.id === 3) {
            series.watchedEpisode = animes.episodes;
            setWatchedEpisode(animes.episodes);
        }
        series.categoryId = category.id;
        if (series.id) {
            await updateSeries(series.id, series);
        } else {
            await createSeries(series);
        }

        await getAnimes(params.id);
    };

    const deleteFromMylist = async (id: number) => {
        setSeries(defaultValues);
        await deleteSeriesByAnimeId(id);
        setIsSeries(false);
        setCategory({});
    };
    const AddToMyList = async () => {
        if (series.id) {
            return;
        }
        const seriesRequest = {
            animeId: animes.id,
            watchedEpisode: 0,
            categoryId: 1,
            isFavorite: false,
        };
        await createSeries(seriesRequest);
        await getAnimes(params.id);
    };

    const { Title, Text } = Typography;
    const items: MenuProps["items"] = categories;
    const menuProps = {
        items,
    };
    return (
        <div className="container">
            <title>
                {!animes?.title
                    ? "Series Tracker"
                    : `Series Tracker - ${animes.subTitle}`}
            </title>
            <Loading loading={loading} />
            {!loading && (
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
                                <Flex
                                    style={{ zIndex: 0, position: "relative" }}
                                >
                                    <AbsoluteImage
                                        src={animes.pictureUrl}
                                        zIndex={-1}
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
                                            className={
                                                styles["anime-detail-row"]
                                            }
                                            align={"bottom"}
                                            justify={"center"}
                                        >
                                            <Col lg={24} xl={6} xxl={5}>
                                                <Flex justify="center">
                                                    <Image
                                                        style={{
                                                            maxHeight: "380px",
                                                            pointerEvents:
                                                                "none",
                                                        }}
                                                        preview={false}
                                                        src={animes.pictureUrl}
                                                        fallback={
                                                            noFoundImage.src
                                                        }
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
                                                        styles[
                                                            "flex-anime-detail"
                                                        ]
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
                                                                {animes.title}
                                                            </Title>
                                                        }
                                                        description={
                                                            <Text
                                                                italic
                                                                type="secondary"
                                                            >
                                                                {
                                                                    animes.subTitle
                                                                }
                                                            </Text>
                                                        }
                                                    />
                                                    <GenreDescription
                                                        genresString={
                                                            animes.genres
                                                        }
                                                    />
                                                    <InfoDescription
                                                        items={[
                                                            {
                                                                text: animes.kind,
                                                                icon: (
                                                                    <InfoCircleOutlined />
                                                                ),
                                                            },
                                                            {
                                                                text: animes.rating,
                                                                icon: (
                                                                    <TeamOutlined />
                                                                ),
                                                            },
                                                            {
                                                                text: animes.status,
                                                                icon: (
                                                                    <FireOutlined />
                                                                ),
                                                            },

                                                            {
                                                                text: animes.startDate
                                                                    ? new Date(
                                                                          animes.startDate
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
                                                                text: `${animes.episodes} эп.`,
                                                                icon: (
                                                                    <YoutubeOutlined />
                                                                ),
                                                            },
                                                            {
                                                                text: `${animes.duration} мин.`,
                                                                icon: (
                                                                    <ClockCircleOutlined />
                                                                ),
                                                            },
                                                            {
                                                                text: `${animes.score} из 10`,
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
                                                            <Tooltip
                                                                title={
                                                                    isFavorite
                                                                        ? "Удалить из избранного"
                                                                        : "Добавить в избранное"
                                                                }
                                                            >
                                                                <Rate
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
                                                            </Tooltip>
                                                            <Dropdown.Button
                                                                size="small"
                                                                menu={menuProps}
                                                                icon={
                                                                    <DownOutlined />
                                                                }
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
                                                                {isSeries ? (
                                                                    <BookOutlined />
                                                                ) : (
                                                                    <PlusOutlined />
                                                                )}
                                                                {series.categoryId ===
                                                                    0 &&
                                                                    "Добавить в мой список"}
                                                                {category &&
                                                                    category.name}
                                                            </Dropdown.Button>

                                                            {series.categoryId >
                                                                1 && (
                                                                <InputNumber
                                                                    readOnly={
                                                                        series.categoryId ===
                                                                        3
                                                                    }
                                                                    value={
                                                                        watchedEpisode
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) => {
                                                                        updateEpisodeSeries(
                                                                            value
                                                                        );
                                                                    }}
                                                                    size="small"
                                                                    maxLength={
                                                                        4
                                                                    }
                                                                    addonBefore={
                                                                        <Button
                                                                            disabled={
                                                                                series.categoryId ===
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
                                                                                series.categoryId ===
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
                                                                        animes.episodes
                                                                    }
                                                                    prefix={
                                                                        "Эпизоды:"
                                                                    }
                                                                    suffix={`из ${animes.episodes} эп.`}
                                                                    min={0}
                                                                    defaultValue={
                                                                        series.watchedEpisode
                                                                    }
                                                                    variant="filled"
                                                                    step={1}
                                                                    controls={
                                                                        false
                                                                    }
                                                                />
                                                            )}
                                                        </Space>
                                                    ) : (
                                                        <Button
                                                            ghost
                                                            type="primary"
                                                            href="/login"
                                                        >
                                                            Войдите, чтобы
                                                            добавить в свой
                                                            список
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
                                        animes.description
                                            ? animes.description
                                            : "Описание отсутствует"
                                    }
                                />
                                <Collapse
                                    items={[
                                        ...(animes.screenshots.length > 0
                                            ? [
                                                  {
                                                      key: "1",
                                                      label: "Посмотреть кадры",
                                                      children: (
                                                          <ScreenshotsPreview
                                                              screenshots={animes.screenshots.slice(
                                                                  0,
                                                                  4
                                                              )}
                                                              id={Number(
                                                                  params.id
                                                              )}
                                                          />
                                                      ),
                                                  },
                                              ]
                                            : []),

                                        ...(animes.relateds.length > 0
                                            ? [
                                                  {
                                                      key: "2",
                                                      label: "Связанное с этим аниме",
                                                      children: (
                                                          <RelatedAnimes
                                                              animes={
                                                                  animes.relateds
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
            )}
            <FloatButton.BackTop style={{ right: 24 }} />
        </div>
    );
}
