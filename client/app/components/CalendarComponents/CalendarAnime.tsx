// CalendarAnime.tsx
import { CalendarAnimeItem } from "@/app/models/anime/CalendarAnimeItem";
import { dateComparer } from "@/app/utils/dateUtils";
import { FireFilled, QuestionCircleOutlined } from "@ant-design/icons";
import {
    Badge,
    Card,
    Col,
    Descriptions,
    Flex,
    Row,
    Skeleton,
    Tag,
    Typography,
} from "antd";
import Link from "next/link";
import React from "react";
import LoadAnimateImage from "../LoadAnimateImage";
import styles from "./component.module.css";

const { Text, Title } = Typography;

// Интерфейс для props компонента CalendarAnime
interface Props {
    item: CalendarAnimeItem; // Данные об аниме
    loading: boolean; // Флаг, указывающий, загружаются ли данные
}

/**
 * @component CalendarAnime
 * @description Компонент для отображения аниме в списке.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const CalendarAnime: React.FC<Props> = ({
    item,
    loading,
}: Props): JSX.Element => {
    return (
        <Skeleton
            className={styles["calendar-skeleton"]}
            loading={loading}
            active
            avatar={{
                className: styles["calendar-skeleton-image"],
                shape: "square",
            }}
            paragraph={{ rows: 1 }}
        >
            <Link href={`/animes/${item.anime.id}`}>
                <Badge.Ribbon
                    className={
                        item.nextEpisode === item.anime.episodes ? "" : "hidden"
                    }
                    color="volcano"
                    text={
                        <Tag
                            className="transparent"
                            bordered={false}
                            icon={<FireFilled />}
                        >
                            Финальный эп.
                        </Tag>
                    }
                >
                    <Card hoverable className={styles.card}>
                        <Row align={"middle"}>
                            <Col>
                                <LoadAnimateImage
                                    preview={false}
                                    maxWidth={100}
                                    alt={`image-${item.anime.id}`}
                                    src={`https://shikimori.one${item.anime.image.preview}`}
                                ></LoadAnimateImage>
                            </Col>
                            <Col
                                offset={1}
                                xs={14}
                                sm={14}
                                md={16}
                                lg={16}
                                xl={16}
                                xxl={16}
                            >
                                <Text className={styles.title} strong>
                                    {item.anime.russian
                                        ? item.anime.russian
                                        : item.anime.name}
                                </Text>
                                <Descriptions
                                    items={[
                                        {
                                            key: "1",
                                            label: "Вышло",
                                            children: (
                                                <Flex gap={5}>
                                                    <Text>
                                                        {
                                                            item.anime
                                                                .episodesAired
                                                        }
                                                    </Text>
                                                    <Text>{"из"}</Text>
                                                    {item.anime.episodes > 0 ? (
                                                        <Text>
                                                            {
                                                                item.anime
                                                                    .episodes
                                                            }
                                                        </Text>
                                                    ) : (
                                                        <QuestionCircleOutlined />
                                                    )}
                                                    <Text>{"эп."}</Text>
                                                </Flex>
                                            ),
                                        },
                                    ]}
                                />
                            </Col>
                            <Col
                                className={styles["calendar-anime-episodes"]}
                                offset={1}
                                lg={2}
                                xl={2}
                                xxl={2}
                            >
                                <Title level={4}>
                                    {`${item.nextEpisode} эп.`}
                                </Title>
                                <Flex gap={5}>
                                    <Text>
                                        {new Date(
                                            item.nextEpisodeAt
                                        ).toLocaleTimeString("ru-RU", {
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </Text>

                                    {dateComparer(
                                        new Date(),
                                        new Date(item.nextEpisodeAt)
                                    )}
                                </Flex>
                            </Col>
                        </Row>
                    </Card>
                </Badge.Ribbon>
            </Link>
        </Skeleton>
    );
};

export default CalendarAnime;
