import { Button, Col, Flex, Row, Tag, Image, Typography, Space } from "antd";
import {
    CalendarOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";
interface Props {
    anime: SeriesAnime;
    isOpen: boolean;
}

export const AnimeDetailPopover = ({ anime }: Props) => {
    const { Text, Title, Paragraph } = Typography;
    return (
        <Row style={{ maxWidth: 600, minHeight: 250 }} justify={"start"}>
            <Col span={7}>
                <Image src={anime.pictureUrl} />
            </Col>
            <Col offset={1} span={16}>
                <Row className="height-100">
                    <Col span={24}>
                        <Flex className="flex-column">
                            <Title
                                className={"trimText title"}
                                level={5}
                                style={{ marginBottom: 0 }}
                            >
                                {anime.title}
                            </Title>
                            <Text
                                className={"trimText subTitle"}
                                strong
                                style={{ marginBottom: 5 }}
                                italic
                                type="secondary"
                            >
                                {anime.subTitle}
                            </Text>
                            <Paragraph className={"trimText description"}>
                                <Text strong type="secondary">
                                    Описание:{" "}
                                </Text>
                                {!anime.description
                                    ? "отсутствует"
                                    : anime.description}
                            </Paragraph>
                            <Space align="center" size={[0, 5]} wrap>
                                <Tag
                                    className="tag"
                                    icon={<InfoCircleOutlined />}
                                >
                                    {`${anime.kind}`}
                                </Tag>
                                <Tag className="tag" icon={<TeamOutlined />}>
                                    {anime.rating}
                                </Tag>
                                <Tag
                                    className="tag"
                                    icon={<CalendarOutlined />}
                                >
                                    {anime.startDate}
                                </Tag>
                                <Tag className="tag" icon={<YoutubeOutlined />}>
                                    {`${anime.episodes} эп.`}
                                </Tag>
                                <Tag className="tag" icon={<StarOutlined />}>
                                    {anime.score}
                                </Tag>
                            </Space>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <Button
                            type="primary"
                            href={`/shikimori/${anime.id}`}
                            className="width-100"
                        >
                            <Text strong style={{ fontSize: 15 }}>
                                Посмотреть подробнее
                            </Text>
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimeDetailPopover;
