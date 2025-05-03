import { Anime } from "@/app/models/anime/Anime";
import {
    CalendarOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, Image, Row, Space, Tag, Typography } from "antd";
import MainShortInfo from "../MainShortInfo/MainShortInfo";
interface Props {
    anime: Anime;
    isOpen: boolean;
}

export const AnimeDetailPopover = ({ anime }: Props) => {
    const { Text } = Typography;
    return (
        <Row style={{ maxWidth: 600 }} justify={"start"}>
            <Col span={7}>
                <Flex className="height-100" align="center">
                    <Image preview={false} src={anime.pictureUrl} />
                </Flex>
            </Col>
            <Col offset={1} span={16}>
                <Row className="height-100">
                    <Col span={24} style={{ marginBottom: 10 }}>
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
                    <Col span={24} style={{ marginTop: "auto" }}>
                        <Button
                            style={{ fontWeight: 600, fontSize: 15 }}
                            href={`/animes/${anime.id}`}
                            block
                        >
                            Посмотреть подробнее
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimeDetailPopover;
