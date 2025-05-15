import AbsoluteImage from "@/app/components/AbsoluteImage";
import BelowButtons from "@/app/components/AnimeDetail/BelowButtons";
import GenreDescription from "@/app/components/AnimeDetail/GenreDescription";
import InfoDescription from "@/app/components/AnimeDetail/InfoDescription";
import ScreenshotsPreview from "@/app/components/AnimeDetail/ScreenshotsPreview";
import Relatedanimes from "@/app/components/RelatedAnimes/RelatedAnimes";
import { defaultCategories } from "@/app/constants/constants";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import noFoundImage from "@/app/img/img-error.jpg";
import { AnimeDetail } from "@/app/models/anime/AnimeDetail";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    FireOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import {
    Card,
    Col,
    Collapse,
    ConfigProvider,
    Flex,
    FloatButton,
    Image,
    Row,
    Typography,
} from "antd";
import Link from "next/link";
import { useMemo } from "react";
import Loading from "../Loading";
import styles from "./component.module.css";

const { Title, Text } = Typography;
interface Props {
    anime: AnimeDetail;
    isLoading: boolean;
    error: any;
    user?: User;
}
const AnimeDetailsContent: React.FC<Props> = ({
    anime,
    isLoading,
    error,
    user,
}: Props): JSX.Element => {
    const filteredCategories = useMemo(() => {
        if (!anime) return defaultCategories;
        return defaultCategories.filter(
            (category) => category.value !== anime.categoryId
        );
    }, [anime]);

    if (isLoading) {
        return <Loading loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>; // Обработка ошибки
    }

    if (!anime) {
        return <p>No anime data available.</p>; // Обработка случая, когда anime равно null
    }

    return (
        <div className="container">
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
                            <Flex className={styles["overlay"]}>
                                <AbsoluteImage
                                    src={anime.pictureUrl}
                                    zIndex={-1}
                                    filter={true}
                                />

                                <Link
                                    className={styles["back-btn"]}
                                    href={"./"}
                                >
                                    <LongLeftArrow />
                                </Link>

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
                                                    alt="preview-image"
                                                    className={
                                                        styles["preview-image"]
                                                    }
                                                    preview={false}
                                                    src={anime.pictureUrl}
                                                    fallback={noFoundImage.src}
                                                />
                                                {anime.categoryId > 0 && (
                                                    <Text
                                                        className={
                                                            styles["cover-text"]
                                                        }
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
                                className={styles["inner-card"]}
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
                                                          id={Number(anime.id)}
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
                            />
                        </Card>
                    </Col>
                </Row>
            </ConfigProvider>
            <FloatButton.BackTop className="float-btn" />
        </div>
    );
};

export default AnimeDetailsContent;
