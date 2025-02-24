import { Button, Col, Flex, Row, Tag, Image, Typography, Space } from "antd";
import {
    CalendarOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";
import MainShortInfo from "../MainShortInfo/MainShortInfo";
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
                        <MainShortInfo
                            title={anime.title}
                            subTitle={anime.subTitle}
                            description={anime.description}
                            showDescription
                            strongSubTitle
                        >
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
                        </MainShortInfo>
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
