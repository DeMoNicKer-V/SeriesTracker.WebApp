"use client";
import styles from "./page.module.css";
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
    InputNumber,
    Rate,
    ConfigProvider,
    InputNumberProps,
    Select,
    Divider,
} from "antd";
import { useState } from "react";
import AbsoluteImage from "@/app/components/AbsoluteImage";
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
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import noFoundImage from "@/app/img/img-error.jpg";
import Relatedanimes from "@/app/components/RelatedAnimes/RelatedAnimes";
import InfoDescription from "@/app/components/AnimeDetailDescription/InfoDescription";
import GenreDescription from "@/app/components/AnimeDetailDescription/GenreDescription";
import ScreenshotsPreview from "@/app/components/AnimeDetailDescription/ScreenshotsPreview";
import Loading from "@/app/components/Loading";
import {
    Anime,
    defaultAnimeValues as defaultValues,
} from "@/app/Models/Anime/Anime";
import useSWR, { mutate } from "swr";
import { getAnimeById } from "@/app/api/shikimori/anime/getAnime";
import { updateSeries } from "@/app/api/series/editSeries";
import { createSeries } from "@/app/api/series/createSeries";
import { getDecodedUserToken } from "@/app/utils/cookie";

const { Title, Text } = Typography;

const defaultCategories = [
    { value: 1, label: "Запланировано" },
    { value: 2, label: "Смотрю" },
    { value: 3, label: "Просмотрено" },
    { value: 4, label: "Пересматриваю" },
    { value: 5, label: "Отложено" },
    { value: 6, label: "Брошено" },
];

export default function AnimePage({ params }: { params: { id: string } }) {
    const [filteredCategories, setFilteredCategories] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [watchedEpisode, setWatchedEpisode] = useState<number>(0);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const checkAuth = async () => {
        const token = await getDecodedUserToken();
        setIsAuth(token !== null);
    };

    const getAnime = async (id: string) => {
        const response = await getAnimeById(id);
        checkAuth();
        setWatchedEpisode(
            response.watchedEpisodes === null ? 0 : response.watchedEpisodes
        );
        setIsFavorite(
            response.isFavorite === null ? false : response.isFavorite
        );
        setFilteredCategories(
            defaultCategories.filter(
                (category) => category.value !== response.categoryId
            )
        );
        return response;
    };

    const { data: anime = defaultValues, isLoading } = useSWR<Anime>(
        params.id,
        getAnime,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryInterval: 30000,
        }
    );

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

        mutate(params.id);
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

        mutate(params.id);
    };

    const deleteSeriesById = async (seriesId: string) => {
        await deleteSeriesById(seriesId);
        mutate(params.id);
    };

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
                        Select: {
                            colorText: anime.categoryColor,
                            activeBorderColor: anime.categoryColor,
                            hoverBorderColor: anime.categoryColor,
                        },
                    },
                }}
            >
                <Row align={"middle"} justify={"center"}>
                    <Col xxl={19} md={21}>
                        <Card style={{ opacity: 0.9 }}>
                            <Flex style={{ zIndex: 0, position: "relative" }}>
                                <AbsoluteImage
                                    src={anime.pictureUrl}
                                    zIndex={-1}
                                    filter="contrast(225%) brightness(75%)"
                                />

                                <Button
                                    href={"./"}
                                    type="primary"
                                    icon={<LongLeftArrow />}
                                    style={{
                                        margin: 20,
                                        position: "absolute",
                                    }}
                                ></Button>

                                <div id={styles["overlay-background"]}>
                                    <Row
                                        gutter={[5, 5]}
                                        className={styles["anime-detail-row"]}
                                        align={"bottom"}
                                        justify={"center"}
                                    >
                                        <Col lg={24} xl={6} xxl={5}>
                                            <Flex justify="center" align="end">
                                                <Image
                                                    style={{
                                                        maxHeight: "380px",
                                                    }}
                                                    preview={false}
                                                    src={anime.pictureUrl}
                                                    fallback={noFoundImage.src}
                                                />
                                                {anime.categoryId > 0 && (
                                                    <Text
                                                        strong
                                                        italic
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            fontSize: 13,
                                                            textShadow:
                                                                "1px 1px 2px black",
                                                            top: -25,
                                                        }}
                                                    >
                                                        {`Добавлено: ${new Date(
                                                            anime.addedDate
                                                        ).toLocaleString(
                                                            "ru-Ru",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}`}
                                                    </Text>
                                                )}
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
                                                <Title level={3}>
                                                    {anime.title}
                                                </Title>
                                                <Text italic type="secondary">
                                                    {anime.subTitle}
                                                </Text>

                                                <GenreDescription
                                                    genresList={anime.genres}
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
                                                        className={
                                                            styles[
                                                                "manage-buttons"
                                                            ]
                                                        }
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

                                                        <Select
                                                            onChange={(
                                                                value: string
                                                            ) =>
                                                                updateCategorySeries(
                                                                    anime,
                                                                    Number(
                                                                        value
                                                                    )
                                                                )
                                                            }
                                                            rootClassName={
                                                                styles[
                                                                    "selector"
                                                                ]
                                                            }
                                                            size="small"
                                                            style={{
                                                                width: 240,
                                                                textAlign:
                                                                    "start",
                                                            }}
                                                            defaultActiveFirstOption={
                                                                false
                                                            }
                                                            prefix={
                                                                <BookOutlined />
                                                            }
                                                            value={
                                                                anime.categoryName
                                                            }
                                                            placement="topLeft"
                                                            placeholder={
                                                                <Flex gap={5}>
                                                                    <PlusOutlined />
                                                                    {
                                                                        "Добавить в мой список"
                                                                    }
                                                                </Flex>
                                                            }
                                                            dropdownRender={(
                                                                menu: any
                                                            ) => (
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
                                                                            icon={
                                                                                <CloseOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                deleteSeriesById(
                                                                                    anime.seriesId
                                                                                )
                                                                            }
                                                                        >
                                                                            Удалить
                                                                            из
                                                                            списка
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            )}
                                                            options={
                                                                filteredCategories
                                                            }
                                                        />

                                                        {anime.seriesId && (
                                                            <InputNumber
                                                                className={
                                                                    styles[
                                                                        "episodes-input"
                                                                    ]
                                                                }
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
                            <Flex className={styles["description"]}>
                                <Title level={3}>Описание</Title>
                                <Text
                                    className={styles["descriptionText"]}
                                    type="secondary"
                                >
                                    {anime.description
                                        ? anime.description
                                        : "Описание отсутствует"}
                                </Text>
                            </Flex>
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
