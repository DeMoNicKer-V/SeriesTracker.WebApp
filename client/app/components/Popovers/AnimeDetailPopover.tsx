import { Anime } from "@/app/models/anime/Anime";
import {
    CalendarOutlined,
    InfoCircleOutlined,
    StarOutlined,
    TeamOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, Image, Row, Space, Tag } from "antd";
import ShortInfo from "../ShortInfo/ShortInfo";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента AnimeDetailPopover
interface Props {
    anime: Anime; // Объект аниме (обязательно)
}

/**
 * @component AnimeDetailPopover
 * @description Компонент для отображения всплывающей подсказки с детальной информацией об аниме.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const AnimeDetailPopover: React.FC<Props> = ({ anime }: Props): JSX.Element => {
    return (
        <Row className={styles["anime-popover"]} justify={"start"}>
            <Col span={7}>
                <Flex className="height-100" align="center">
                    <Image
                        alt={`preview-${anime.id}`}
                        preview={false}
                        src={anime.pictureUrl}
                    />
                </Flex>
            </Col>
            <Col offset={1} span={16}>
                <Row className="height-100">
                    <Col span={24} className={styles["anime-popover-head"]}>
                        <ShortInfo
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
                        </ShortInfo>
                    </Col>
                    <Col span={24} style={{ marginTop: "auto" }}>
                        <Button
                            className={styles["anime-popover-btn"]}
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
