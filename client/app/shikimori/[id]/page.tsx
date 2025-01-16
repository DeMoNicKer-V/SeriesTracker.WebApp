"use client";
import {
    Button,
    Card,
    Col,
    Image,
    Flex,
    Row,
    Tag,
    Tooltip,
    Typography,
    FloatButton,
    Divider,
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
import AnimeDetailDescription from "@/app/components/AnimeDetailDescription/InfoDescription";
import GenreDescription from "@/app/components/AnimeDetailDescription/GenreDescription";

export default function AnimePage({ params }: { params: { id: string } }) {
    const defaultValues = {
        animeId: 0,
        watchedEpisode: 0,
        categoryId: 0,
        isFavorite: false,
    } as Series;
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
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
                animeId: animes.id,
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

    const cardStyle: React.CSSProperties = {
        padding: "20% 20px 20px 20px",
    };

    const subCol: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "10px",
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
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />
            {!loading && (
                <ConfigProvider
                    theme={{
                        components: {
                            Card: { bodyPadding: 0 },
                            Divider: {
                                verticalMarginInline: 0,
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
                                    <div className="overlay-background">
                                        <Row
                                            className="anime-detail-row"
                                            align={"bottom"}
                                            justify={"center"}
                                            style={cardStyle}
                                        >
                                            <Col lg={24} xl={7} xxl={5}>
                                                <Flex className="flex-detail">
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
                                                className="anime-detail-col"
                                                style={subCol}
                                                xs={24}
                                                sm={24}
                                                lg={24}
                                                md={24}
                                                xl={17}
                                                xxl={19}
                                            >
                                                <Meta
                                                    className="anime-detail-title"
                                                    style={{
                                                        marginBottom: 0,
                                                        fontSize: 17,
                                                    }}
                                                    title={
                                                        <Title level={3}>
                                                            {animes.title}
                                                        </Title>
                                                    }
                                                    description={
                                                        animes.subTitle
                                                    }
                                                />
                                                <GenreDescription
                                                    genresString={animes.genres}
                                                />
                                                <AnimeDetailDescription
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
                                                            text: new Date(
                                                                animes.startDate
                                                            ).toLocaleString(
                                                                "ru-Ru",
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                }
                                                            ),
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
                                                                maxLength={4}
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
                                                                    <Text>
                                                                        {
                                                                            "Эпизоды:"
                                                                        }
                                                                    </Text>
                                                                }
                                                                suffix={
                                                                    <Text>{`из ${animes.episodes} эп.`}</Text>
                                                                }
                                                                min={0}
                                                                defaultValue={
                                                                    series.watchedEpisode
                                                                }
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
                                            </Col>
                                        </Row>
                                    </div>
                                </Flex>
                                <Meta
                                    style={{ padding: 24 }}
                                    title={<Title level={3}>Описание</Title>}
                                    description={animes.description}
                                />
                                <Collapse
                                    items={[
                                        {
                                            key: "1",
                                            label: "Посмотреть кадры",
                                            children: (
                                                <Row
                                                    gutter={[0, 15]}
                                                    justify={"center"}
                                                >
                                                    <Col span={24}>
                                                        <Image.PreviewGroup>
                                                            <Flex
                                                                justify="center"
                                                                wrap
                                                                align="center"
                                                                gap={10}
                                                            >
                                                                {animes.screenshots
                                                                    .slice(0, 4)
                                                                    .map(
                                                                        (
                                                                            animes: Screenshot
                                                                        ) => (
                                                                            <Image
                                                                                style={{
                                                                                    maxWidth: 280,
                                                                                }}
                                                                                preview={{
                                                                                    mask: "Посмотреть",
                                                                                }}
                                                                                src={
                                                                                    animes.originalUrl
                                                                                }
                                                                            ></Image>
                                                                        )
                                                                    )}
                                                            </Flex>
                                                        </Image.PreviewGroup>
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            type="link"
                                                            href={`${params.id}/screen`}
                                                            icon={
                                                                <LongRightArrow />
                                                            }
                                                            iconPosition="end"
                                                        >
                                                            Посмотреть больше
                                                            кадров
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ),
                                        },
                                        {
                                            key: "2",
                                            label: "Связанное с этим аниме",
                                            children: (
                                                <RelatedAnimes
                                                    animes={animes.relateds}
                                                />
                                            ),
                                        },
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
