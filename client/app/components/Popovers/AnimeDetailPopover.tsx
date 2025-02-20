import { Button, Col, Flex, Row, Tag, Image, Typography, Space } from "antd";
import {
    CalendarOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { SeriesAnime } from "@/app/Models/Anime/SeriesAnime";

import styles from "./component.module.css";
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
                                className={`${styles.trimText} ${styles.title}`}
                                level={5}
                                style={{ marginBottom: 0 }}
                            >
                                {anime.title}
                            </Title>
                            <Text
                                className={`${styles.trimText} ${styles.subTitle}`}
                                strong
                                style={{ marginBottom: 5 }}
                                italic
                                type="secondary"
                            >
                                {anime.subTitle}
                            </Text>
                            <Paragraph
                                className={`${styles.trimText} ${styles.description}`}
                            >
                                <Text strong type="secondary">
                                    Описание:{" "}
                                </Text>
                                {!anime.description
                                    ? "отсутствует"
                                    : anime.description}
                            </Paragraph>
                            <Space align="center" size={[0, 5]} wrap>
                                <Tag icon={<InfoCircleOutlined />}>
                                    {`${anime.kind}`}
                                </Tag>
                                <Tag icon={<TeamOutlined />}>
                                    {anime.rating}
                                </Tag>
                                <Tag icon={<CalendarOutlined />}>
                                    {anime.startDate}
                                </Tag>
                                <Tag>
                                    <Flex
                                        gap={3}
                                        align={"center"}
                                        justify={"center"}
                                    >
                                        <YoutubeOutlined />
                                        {`${anime.episodes} эп.`}
                                    </Flex>
                                </Tag>

                                <Tag>
                                    <Flex
                                        gap={3}
                                        align={"center"}
                                        justify={"center"}
                                    >
                                        <StarOutlined />
                                        {anime.score}
                                    </Flex>
                                </Tag>
                            </Space>
                        </Flex>
                    </Col>
                    <Col span={24} style={{ marginTop: "auto" }}>
                        <Button
                            type="primary"
                            href={`/shikimori/${anime.id}`}
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
export default AnimeDetailPopover;
