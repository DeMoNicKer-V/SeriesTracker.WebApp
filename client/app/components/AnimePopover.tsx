"use client";
import {
    Button,
    Card,
    Carousel,
    Col,
    Empty,
    Flex,
    Row,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import {
    FileImageOutlined,
    CalendarOutlined,
    EditOutlined,
    YoutubeOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
interface Props {
    animes: Anime;
    isOpen: boolean;
}

export const AnimePopover = ({ animes }: Props) => {
    const MyObject = () => {
        let obj = [];
        let obj2 = [];
        const a = animes.genres.split(",");
        for (let index = 0; index < a.length; index++) {
            obj.push(<Tag>{a[index]}</Tag>);
            if (index % 3 === 0) {
                obj2.push(<Flex>{obj}</Flex>);
                obj = [];
            } else if (index === a.length) {
                obj2.push(<Flex>{obj}</Flex>);
            }
        }

        return obj2;
    };
    const { Text } = Typography;
    const [genres, setGenres] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const a = MyObject();
        setGenres(a);
    }, []);
    return (
        <Row gutter={[30, 0]} style={{ height: 250, width: 550 }}>
            <Col span={8} offset={1}>
                <div
                    style={{
                        overflow: "hidden",
                        backgroundImage: `url(${animes.pictureUrl})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: "absolute",
                    }}
                ></div>
                {animes.pictureUrl === "" && (
                    <Empty
                        style={{
                            marginTop: 25,
                        }}
                        image={<FileImageOutlined />}
                        imageStyle={{ fontSize: 60 }}
                        description={
                            <span
                                style={{
                                    fontSize: 18,
                                    fontStyle: "italic",
                                }}
                            >
                                Изображение отсутствует
                            </span>
                        }
                    ></Empty>
                )}
            </Col>
            <Col span={15}>
                <Row style={{ marginBottom: 10 }}>
                    <Col>{animes.title}</Col>
                </Row>
                <Row style={{ marginBottom: 5 }}>
                    <Col>
                        <Text className="text">
                            {animes.description === ""
                                ? "Описание отсутствует"
                                : animes.description}
                        </Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tag>
                            <CalendarOutlined />
                            {new Date(animes.startDate).toLocaleString(
                                "ru-Ru",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </Tag>

                        <Tag>
                            <Flex gap={3} align={"center"} justify={"center"}>
                                <YoutubeOutlined />
                                {`${animes.episodes} эп.`}
                            </Flex>
                        </Tag>

                        <Tag>
                            <Flex gap={3} align={"center"} justify={"center"}>
                                <StarOutlined />
                                {`${animes.score} из 10`}
                            </Flex>
                        </Tag>
                        <Carousel>
                            {genres.map((animes: JSX.Element) => animes)}
                        </Carousel>
                    </Col>
                </Row>
                <Row style={{ position: "absolute", bottom: 0 }}>
                    <Col>
                        <Button>Подробнее</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimePopover;
