import { Button, Card, Col, Flex, Row, Tag, Typography } from "antd";
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
    series: Series["item1"];
    isOpen: boolean;
}

const cardStyle: React.CSSProperties = {
    width: "100%",
};

const imgStyle: React.CSSProperties = {
    display: "block",
    width: 133,
};

export const ShortDescription = ({ series, isOpen }: Props) => {
    return (
        <Row gutter={[30, 0]} style={{ height: 250, width: 550 }}>
            <Col span={8} offset={1}>
                <div
                    style={{
                        overflow: "hidden",
                        backgroundImage: `url(${series.imagePath})`,
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
            </Col>
            <Col span={15}>
                <Row style={{ marginBottom: 10 }}>
                    <Col>{series.title}</Col>
                </Row>
                <Row style={{ marginBottom: 5 }}>
                    <Col>
                        {series.description === ""
                            ? "Описание отсутствует"
                            : series.description}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tag>
                            <Flex gap={3} align={"center"} justify={"center"}>
                                <CalendarOutlined />
                                {new Date(series.releaseDate).toLocaleString(
                                    "ru-Ru",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                                <InfoCircleOutlined />
                            </Flex>
                        </Tag>

                        <Tag>
                            <Flex gap={3} align={"center"} justify={"center"}>
                                <YoutubeOutlined />
                                {`${series.watchedEpisode} из ${series.lastEpisode}`}
                            </Flex>
                        </Tag>
                        <Tag>
                            <Flex gap={3} align={"center"} justify={"center"}>
                                <StarOutlined />
                                {`${series.rating} из 10`}
                            </Flex>
                        </Tag>
                    </Col>
                </Row>
                <Row style={{ position: "absolute", bottom: 0 }}>
                    <Col>
                        <Flex gap={5}>
                            <Button>Подробнее</Button>
                            <Button>Изменить</Button>
                            <Button>Удалить</Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default ShortDescription;
