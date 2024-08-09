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
    Image,
    Typography,
    Space,
    Slider,
} from "antd";
import {
    FileImageOutlined,
    CalendarOutlined,
    EditOutlined,
    YoutubeOutlined,
    LeftOutlined,
    RightOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import Meta from "antd/es/card/Meta";
interface Props {
    animes: SeriesAnime;
    isOpen: boolean;
}

export const AnimePopover = ({ animes }: Props) => {
    const { Text } = Typography;
    const [genres, setGenres] = useState<JSX.Element[]>([]);
    return (
        <Row style={{ maxWidth: 600 }} justify={"start"}>
            <Col span={7}>
                <Image preview={false} src={animes.pictureUrl} />
            </Col>
            <Col span={16} offset={1}>
                <Row style={{ height: "100%" }}>
                    <Col span={24}>
                        <Meta
                            style={{
                                marginBottom: 8,
                                fontSize: 14,
                            }}
                            title={
                                <Title
                                    style={{
                                        margin: 0,
                                    }}
                                    level={5}
                                >
                                    {animes.title}
                                </Title>
                            }
                            description={<Text italic>{animes.subTitle}</Text>}
                        />

                        <Text style={{ marginBottom: 5 }} className="text">
                            {animes.description === ""
                                ? "Описание отсутствует"
                                : animes.description}
                        </Text>
                        <Space align="center" size={[0, 5]} wrap>
                            <Tag>
                                <Flex
                                    gap={3}
                                    align={"center"}
                                    justify={"center"}
                                >
                                    <CalendarOutlined />
                                    {new Date(animes.startDate).toLocaleString(
                                        "ru-Ru",
                                        {
                                            year: "numeric",
                                        }
                                    )}
                                </Flex>
                            </Tag>
                            <Tag>
                                <Flex
                                    gap={3}
                                    align={"center"}
                                    justify={"center"}
                                >
                                    <InfoCircleOutlined />
                                    {`${animes.kind}`}
                                </Flex>
                            </Tag>

                            <Tag>
                                <Flex
                                    gap={3}
                                    align={"center"}
                                    justify={"center"}
                                >
                                    <YoutubeOutlined />
                                    {`${animes.episodes} эп.`}
                                </Flex>
                            </Tag>

                            <Tag>
                                <Flex
                                    gap={3}
                                    align={"center"}
                                    justify={"center"}
                                >
                                    <StarOutlined />
                                    {animes.score}
                                </Flex>
                            </Tag>
                        </Space>
                    </Col>
                    <Col style={{ marginTop: "auto" }} span={24}>
                        <Button type="primary" style={{ width: "100%" }}>
                            Посмотреть подробнее
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimePopover;
