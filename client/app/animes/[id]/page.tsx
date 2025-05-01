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
    ConfigProvider,
} from "antd";
import { useState } from "react";
import AbsoluteImage from "@/app/components/AbsoluteImage";
import {
    StarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    FireOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
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
import useSWR from "swr";
import { getAnimeById } from "@/app/api/animes/getAnime";
import PageErrorView from "@/app/components/PageErrorVIew";
import { useUser } from "@/app/components/UserContext";
import BelowButtons from "@/app/components/AnimeDetailDescription/BelowButtons";

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
    const { user } = useUser();

    const getAnime = async (id: string) => {
        const response = await getAnimeById(id);
        setFilteredCategories(
            defaultCategories.filter(
                (category) => category.value !== response.categoryId
            )
        );
        return response;
    };

    const {
        data: anime = defaultValues,
        isLoading,
        error,
    } = useSWR<Anime>(params.id, getAnime, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 0,
    });

    if (error) {
        return <PageErrorView text={error.message} />;
    }
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
                            activeBorderColor: anime.categoryColor,
                            hoverBorderColor: anime.categoryColor,
                        },
                    },
                }}
            >
                <Row align={"middle"} justify={"center"}>
                    <Col xxl={19} md={21}>
                        <Card>
                            <Flex style={{ zIndex: 0, position: "relative" }}>
                                <AbsoluteImage
                                    src={anime.pictureUrl}
                                    zIndex={-1}
                                    filter="contrast(150%) brightness(50%) opacity(90%)"
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
                                                <BelowButtons
                                                    anime={anime}
                                                    auth={user != null}
                                                    categories={
                                                        filteredCategories
                                                    }
                                                />
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
