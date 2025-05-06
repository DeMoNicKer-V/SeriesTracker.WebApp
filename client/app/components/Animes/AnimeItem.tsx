// CalendarAnime.tsx
import { Anime } from "@/app/models/anime/Anime";
import { FireOutlined, StarOutlined } from "@ant-design/icons";
import {
    Badge,
    Card,
    Col,
    Divider,
    Flex,
    Popover,
    Row,
    Skeleton,
    Tag,
    Typography,
} from "antd";
import Link from "next/link";
import React from "react";
import AbsoluteImage from "../AbsoluteImage";
import AnimeDetailPopover from "../Popovers/AnimeDetailPopover";
import styles from "./component.module.css";

const { Text } = Typography;

// Интерфейс для props компонента CalendarAnime
interface Props {
    anime: Anime; // Данные об аниме
    loading: boolean; // Флаг, указывающий, загружаются ли данные
    color?: string;
}

/**
 * @component AnimeItem
 * @description Компонент для отображения аниме в списке.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const AnimeItem: React.FC<Props> = ({
    anime,
    loading,
    color,
}: Props): JSX.Element => {
    return (
        <Skeleton
            className={"flex-column"}
            loading={loading}
            active
            style={{ gap: 10 }}
            avatar={{
                shape: "square",
                className: styles["anime-skeleton-image"],
            }}
            paragraph={{ rows: 2 }}
            title={false}
        >
            <Popover
                rootClassName="popover"
                trigger={"hover"}
                mouseEnterDelay={1}
                mouseLeaveDelay={0.2}
                placement="bottomLeft"
                arrow={false}
                content={<AnimeDetailPopover anime={anime} />}
            >
                <Link
                    href={`/animes/${anime.id}`}
                    aria-label={`Подробнее об аниме ${anime.title}`}
                >
                    <Badge.Ribbon
                        color={color}
                        text={
                            <Flex justify="center" align="center">
                                <Flex gap={3} justify="center" align="center">
                                    <StarOutlined style={{ fontSize: 11 }} />
                                    <Text className={styles["cover-text"]}>
                                        {anime.score}
                                    </Text>
                                </Flex>
                                <Divider type="vertical" style={{ top: 0 }} />
                                <Text className={styles["cover-text"]}>
                                    {new Date(anime.startDate).getFullYear()}
                                </Text>
                            </Flex>
                        }
                    >
                        <Card
                            className={styles["anime-card"]}
                            bordered={false}
                            cover={
                                <AbsoluteImage
                                    src={anime.pictureUrl}
                                    zIndex={0}
                                >
                                    {anime.categoryId > 0 && (
                                        <Tag
                                            className={styles["category-tag"]}
                                            color={anime.categoryColor}
                                            bordered={false}
                                        >
                                            <Text
                                                className={styles["cover-text"]}
                                            >
                                                {anime.categoryName}
                                            </Text>
                                        </Tag>
                                    )}
                                </AbsoluteImage>
                            }
                        ></Card>
                    </Badge.Ribbon>
                </Link>
            </Popover>
            <Link
                className="title-link"
                href={`/animes/${anime.id}`}
                aria-label={`Подробнее об аниме ${anime.title}`}
            >
                {anime.title}
            </Link>
            <Row gutter={[0, 5]} style={{ justifyContent: "start" }}>
                <Col>
                    {anime.status.length > 6 ? (
                        <Tag
                            className="tag"
                            color="orange"
                            icon={<FireOutlined />}
                        >
                            {anime.status}
                        </Tag>
                    ) : (
                        <Tag className="tag">{anime.status}</Tag>
                    )}
                </Col>
                <Col>
                    <Tag className="tag">{anime.kind}</Tag>
                </Col>
                <Col>
                    {anime.kind === "Фильм" && (
                        <Tag className="tag">{`${anime.duration} мин.`}</Tag>
                    )}
                    {anime.kind !== "Фильм" && (
                        <Tag className="tag">{`${anime.episodes} эп.`}</Tag>
                    )}
                </Col>
            </Row>
        </Skeleton>
    );
};

export default AnimeItem;
