import {
    Button,
    Card,
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
interface Props {
    animes: Anime;
    isOpen: boolean;
}

const cardStyle: React.CSSProperties = {
    width: "100%",
};

const imgStyle: React.CSSProperties = {
    display: "block",
    width: 133,
};

export const AnimePopover = ({ animes }: Props) => {
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
                        {animes.description === ""
                            ? "Описание отсутствует"
                            : animes.description}
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
                    </Col>
                </Row>
                <Row style={{ position: "absolute", bottom: 0 }}>
                    <Col>
                        <Flex gap={5}>
                            <Button>Подробнее</Button>
                            <Button>Добавить</Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default AnimePopover;
