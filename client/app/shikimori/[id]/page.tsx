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

export default function AnimePage({ params }: { params: { id: string } }) {
    const ref = useRef<HTMLDivElement>(null);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const getAnimes = async (id: string) => {
        console.log(id);
        const series = await getAnimeById(id);
        setAnimes(series);
        const gg = series.genres.split(",");
        setGenres(gg);
    };
    useEffect(() => {
        getAnimes(params.id);
    }, []);

    const cardStyle: React.CSSProperties = {
        padding: "16px",
        height: "100%",
        alignItems: "flex-end",
    };

    const subCol: React.CSSProperties = {
        display: "grid",
        gridAutoFlow: "row",
        gap: "2px",
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
            <Card
                cover={
                    <Flex
                        style={{
                            flex: "1 0 auto",
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
                        <div
                            style={{
                                flex: "1 0",
                                transition:
                                    "padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)",
                                paddingBottom: "56.25%",
                            }}
                        ></div>
                        <AbsoluteImage src={animes.pictureUrl} />
                        <div
                            style={{
                                backgroundImage:
                                    "linear-gradient(180deg, transparent -50%, #121212)",
                                flex: "1 0 0px",
                                maxWidth: "100%",
                                marginLeft: "-100%",
                            }}
                        >
                            <Row style={cardStyle}>
                                <Col span={6}>
                                    <Image
                                        style={{ pointerEvents: "none" }}
                                        preview={false}
                                        src={animes.pictureUrl}
                                    />
                                </Col>
                                <Col style={subCol} offset={1} span={17}>
                                    <Title level={4}>{animes.title}</Title>
                                    <Flex ref={ref} gap="4px 0">
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
                                    <Flex gap="10px">
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
                                        <Flex gap={5}>
                                            <CalendarOutlined />
                                            <Text>
                                                {new Date(
                                                    animes.startDate
                                                ).getFullYear()}
                                            </Text>
                                        </Flex>
                                        <Text>•</Text>
                                        <Flex gap={5}>
                                            <ClockCircleOutlined />
                                            <Text>{`${animes.duration} мин.`}</Text>
                                        </Flex>
                                        <Text>•</Text>
                                        <Flex gap={5}>
                                            <StarOutlined />
                                            <Text>{animes.score}</Text>
                                        </Flex>
                                    </Flex>
                                    <Button
                                        style={{ width: "100%" }}
                                        type="dashed"
                                    >
                                        Добавить в мой список
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
