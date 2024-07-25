"use client";
import {
    Avatar,
    Button,
    Card,
    Carousel,
    Col,
    Image,
    ConfigProvider,
    Flex,
    Row,
    Tag,
    Tooltip,
    Typography,
    FloatButton,
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
    ReadOutlined,
    DesktopOutlined,
    CopyrightOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { title } from "process";
import { createSeries } from "@/app/services/series";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AnimePage({ params }: { params: { id: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [related, setRelated] = useState<Anime[] | any>([]);
    const [isSeries, setIsSeries] = useState<boolean>(false);
    const [flag, setFlag] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[]>([]);
    const getAnimes = async (id: string) => {
        const series = await getAnimeById(id);
        setAnimes(series.anime);
        setIsSeries(series.isSeries);

        console.log(series);
        const gg = series.anime.genres.split(",");
        setGenres(gg);
    };
    useEffect(() => {
        if (params.id) {
            getAnimes(params.id);
        }
    }, []);
    useEffect(() => {
        if (!flag) {
            return;
        }
        const a = MyObject();
        setScreen(a);
    }, [flag]);
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

    const MyObject = () => {
        let obj = [];
        let obj2 = [];
        const a = animes.screenshots;

        for (let index = 0; index < a.length; index++) {
            obj.push(
                <Image
                    preview
                    style={{ width: 300 }}
                    src={a[index].originalUrl}
                ></Image>
            );
            if (obj.length === 3) {
                obj2.push(
                    <Flex justify={"center"} align={"center"} gap={15}>
                        {obj}
                    </Flex>
                );
                obj = [];
            } else if (index === a.length - 1) {
                obj2.push(
                    <Flex justify={"center"} align={"center"} gap={15}>
                        {obj}
                    </Flex>
                );
            }
        }

        return obj2;
    };
    const [screen, setScreen] = useState<JSX.Element[]>([]);
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
                        <div className="overlay-background">
                            <Row
                                className="anime-detail-row"
                                align={"middle"}
                                justify={"center"}
                                style={cardStyle}
                            >
                                <Col xs={24} sm={24} lg={24} xl={6} md={24}>
                                    <Flex className="flex-detail">
                                        <Image
                                            style={{
                                                height: "380px",
                                                pointerEvents: "none",
                                                borderRadius: 5,
                                            }}
                                            preview={false}
                                            src={animes.pictureUrl}
                                        />
                                    </Flex>
                                </Col>
                                <Col
                                    style={subCol}
                                    xs={24}
                                    sm={24}
                                    lg={24}
                                    md={24}
                                    xl={18}
                                >
                                    <Title className="anime-title" level={4}>
                                        {animes.title}
                                    </Title>
                                    <Flex className="flex-detail" gap="4px 0">
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
                                        className="flex-detail"
                                        style={{
                                            display: "ruby",
                                            cursor: "default",
                                        }}
                                        gap="10px"
                                    >
                                        <Flex gap={5}>
                                            <InfoCircleOutlined />
                                            <Text>{animes.kind}</Text>
                                        </Flex>

                                        <Text className="dot-divider">•</Text>
                                        <Flex gap={5}>
                                            <TeamOutlined />
                                            <Text>{animes.rating}</Text>
                                        </Flex>
                                        <Text className="dot-divider">•</Text>
                                        <Flex gap={5}>
                                            <FireOutlined />
                                            <Text>{animes.status}</Text>
                                        </Flex>
                                        <Text className="dot-divider">•</Text>
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
                                        <Text className="dot-divider">•</Text>
                                        <Tooltip
                                            arrow={false}
                                            title={`Ср. длительность эпизода:  ${animes.duration} мин.`}
                                        >
                                            <Flex gap={5}>
                                                <ClockCircleOutlined />
                                                <Text>{`${animes.duration} мин.`}</Text>
                                            </Flex>
                                        </Tooltip>
                                        <Text className="dot-divider">•</Text>
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
                                    <Button
                                        onClick={() => {
                                            setFlag(true);
                                        }}
                                    >
                                        Нажми
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Flex>
                }
            >
                <Meta
                    style={{ padding: 24 }}
                    title={<Title level={3}>Описание</Title>}
                    description={animes.description}
                />

                {flag && (
                    <Carousel
                        style={{ padding: 24 }}
                        dots={false}
                        autoplay
                        arrows
                    >
                        {screen.map((animes: JSX.Element) => animes)}
                    </Carousel>
                )}

                {animes.relateds &&
                    animes.relateds.map((a: Related) => (
                        <Link href={`/shikimori/${a.anime.id}`}>
                            <Card
                                style={{
                                    padding: 10,
                                    margin: 14,
                                }}
                                hoverable
                            >
                                <Row align={"middle"} justify={"start"}>
                                    <Col>
                                        <Image
                                            preview={false}
                                            height={90}
                                            src={a.anime.pictureUrl}
                                        />
                                    </Col>
                                    <Col offset={1}>
                                        <Meta
                                            style={{
                                                padding: 0,
                                                marginBottom: 8,
                                            }}
                                            title={a.anime.title}
                                            description={a.anime.subTitle}
                                        />
                                        <Tag
                                            style={{
                                                cursor: "default",
                                            }}
                                        >
                                            <Flex gap={4}>
                                                <InfoCircleOutlined />
                                                {a.anime.kind}
                                            </Flex>
                                        </Tag>
                                        <Tag
                                            style={{
                                                cursor: "default",
                                            }}
                                        >
                                            <Flex gap={4}>
                                                <CalendarOutlined />
                                                {a.anime.startDate}
                                            </Flex>
                                        </Tag>
                                        <Tag
                                            style={{
                                                cursor: "default",
                                            }}
                                        >
                                            <Flex gap={4}>
                                                <ReadOutlined />
                                                {a.relationText}
                                            </Flex>
                                        </Tag>
                                    </Col>
                                </Row>
                            </Card>
                        </Link>
                    ))}
            </Card>
            <FloatButton.BackTop style={{ right: 24 }} />
        </div>
    );
}
