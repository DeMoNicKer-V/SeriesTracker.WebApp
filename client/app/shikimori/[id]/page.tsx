"use client";
import {
    Avatar,
    Button,
    Card,
    Col,
    ConfigProvider,
    Flex,
    Image,
    Row,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Meta from "antd/es/card/Meta";
import { getAnimeById } from "@/app/services/shikimori";
import AbsoluteImage from "@/app/components/AbsoluteImage";
import {
    StarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    EyeOutlined,
    FireOutlined,
    DesktopOutlined,
    CopyrightOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { title } from "process";
import { createSeries } from "@/app/services/series";
import { useRouter } from "next/navigation";

export default function AnimePage({ params }: { params: { id: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [isSeries, setIsSeries] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[]>([]);
    const getAnimes = async (id: string) => {
        const series = await getAnimeById(id);
        setAnimes(series.anime);
        setIsSeries(series.isSeries);
        const gg = series.anime.genres.split(",");
        setGenres(gg);
    };
    useEffect(() => {
        if (params.id) {
            getAnimes(params.id);
        }
    }, []);
    const router = useRouter();
    const AddToMyList = async () => {
        const seriesRequest = {
            animeId: animes.id,
            title: animes.title,
            description: animes.description,
            imagePath: animes.pictureUrl,
            lastEpisode: animes.episodes,
            watchedEpisode: 0,
            rating: animes.score,
            releaseDate: animes.startDate.toString(),
            isOver: false,
            isFavorite: false,
        };
        await createSeries(seriesRequest);
        router.push(`./`);
    };

    const cardStyle: React.CSSProperties = {
        padding: "22% 20px 20px 20px",
        height: "100%",
        alignItems: "flex-end",
    };

    const subCol: React.CSSProperties = {
        display: "grid",
        gridAutoFlow: "row",
        gap: "3px",
        padding: "10px",
    };
    const { Title, Text } = Typography;
    return (
        <div
            className="container detail"
            style={{
                maxWidth: 1185,
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <title>
                {!animes.title
                    ? "Series Tracker"
                    : `Series Tracker - ${animes.title}`}
            </title>
            <Card
                cover={
                    <Flex
                        style={{
                            maxWidth: "100%",
                            overflow: "hidden",
                            position: "relative",
                            zIndex: 0,
                            borderBottomRightRadius: "0",
                            borderBottomLeftRadius: "0",
                            borderTopRightRadius: "5px",
                            borderTopLeftRadius: "5px",
                        }}
                    >
                        <AbsoluteImage src={animes.pictureUrl} zIndex={-1} />
                        <div
                            style={{
                                backgroundImage:
                                    "linear-gradient(180deg, transparent -50%, #121212)",
                                width: "100%",
                            }}
                        >
                            <Row style={cardStyle}>
                                <Col span={6}>
                                    <Image
                                        style={{
                                            height: "380px",
                                            pointerEvents: "none",
                                            borderRadius: 5,
                                        }}
                                        preview={false}
                                        src={animes.pictureUrl}
                                    />
                                </Col>
                                <Col style={subCol} span={18}>
                                    <Title level={4}>{animes.title}</Title>
                                    <Flex gap="4px 0">
                                        {genres.map((genre: string) => (
                                            <Tag
                                                className="tag"
                                                style={{
                                                    cursor: "default",
                                                    backgroundColor:
                                                        "transparent",
                                                }}
                                            >
                                                {genre}
                                            </Tag>
                                        ))}
                                    </Flex>
                                    <Flex
                                        style={{ cursor: "default" }}
                                        gap="10px"
                                    >
                                        <Flex gap={5}>
                                            <InfoCircleOutlined />
                                            <Text>{animes.kind}</Text>
                                        </Flex>

                                        <Text>•</Text>
                                        <Flex gap={5}>
                                            <TeamOutlined />
                                            <Text>{animes.rating}</Text>
                                        </Flex>
                                        <Text>•</Text>
                                        <Flex gap={5}>
                                            <FireOutlined />
                                            <Text>{animes.status}</Text>
                                        </Flex>
                                        <Text>•</Text>
                                        <Tooltip
                                            arrow={false}
                                            title={`Дата выхода: ${new Date(
                                                animes.startDate
                                            ).toLocaleString("ru-Ru", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}`}
                                        >
                                            <Flex gap={5}>
                                                <CalendarOutlined />
                                                <Text>
                                                    {new Date(
                                                        animes.startDate
                                                    ).getFullYear()}
                                                </Text>
                                            </Flex>
                                        </Tooltip>
                                        <Text>•</Text>
                                        <Tooltip
                                            arrow={false}
                                            title={`Ср. длительность эпизода:  ${animes.duration} мин.`}
                                        >
                                            <Flex gap={5}>
                                                <ClockCircleOutlined />
                                                <Text>{`${animes.duration} мин.`}</Text>
                                            </Flex>
                                        </Tooltip>
                                        <Text>•</Text>
                                        <Tooltip
                                            arrow={false}
                                            title={`Оценка ${animes.score} из 10`}
                                        >
                                            <Flex gap={5}>
                                                <StarOutlined />
                                                <Text>{animes.score}</Text>
                                            </Flex>
                                        </Tooltip>
                                    </Flex>
                                    <Button
                                        disabled={isSeries}
                                        onClick={AddToMyList}
                                        style={{ width: "100%" }}
                                        type="dashed"
                                    >
                                        {!isSeries && "Добавить в мой список"}
                                        {isSeries &&
                                            "Данное аниме уже находится в вашем списке"}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Flex>
                }
            >
                <Meta title="Описание" description={animes.description} />
            </Card>
        </div>
    );
}
