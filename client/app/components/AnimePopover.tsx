import { Button, Col, Flex, Row, Tag, Image, Typography, Space } from "antd";
import {
    CalendarOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Meta from "antd/es/card/Meta";
interface Props {
    animes: SeriesAnime;
    isOpen: boolean;
}

export const AnimePopover = ({ animes }: Props) => {
    const { Text } = Typography;
    return (
        <Row style={{ maxWidth: 600, minHeight: 250 }} justify={"start"}>
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
                                    <TeamOutlined />
                                    {animes.rating}
                                </Flex>
                            </Tag>
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
                        <Button
                            type="primary"
                            href={`/shikimori/${animes.id}`}
                            className="width-100"
                        >
                            Посмотреть подробнее
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimePopover;
