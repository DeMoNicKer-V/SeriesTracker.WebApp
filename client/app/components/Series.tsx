import Card from "antd/es/card/Card";
import ShortDescription from "./SeriesPopover";
import {
    Button,
    Col,
    Dropdown,
    Empty,
    Flex,
    MenuProps,
    Popover,
    Row,
    Tag,
    Typography,
} from "antd";
import Link from "next/link";
import {
    FileImageOutlined,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

interface Props {
    series: Series["item1"][];
}
export const Series = ({ series }: Props) => {
    const { Title } = Typography;
    return (
        <Row gutter={[20, 25]} justify="center">
            {series.map((series: Series["item1"]) => (
                <Col>
                    <Popover
                        trigger={"hover"}
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.2}
                        placement="bottomLeft"
                        arrow={false}
                        content={
                            <ShortDescription series={series} isOpen={false} />
                        }
                    >
                        <Link href={`/series/${series.id}`}>
                            <Card
                                style={{ width: 200, height: 300 }}
                                key={series.id}
                                cover={
                                    <Flex justify="end">
                                        <div
                                            style={{
                                                overflow: "hidden",
                                                backgroundImage: `url(${series.imagePath})`,
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition:
                                                    "center center",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                position: "absolute",
                                            }}
                                        >
                                            {series.isFavorite && (
                                                <Tag
                                                    color="#DE1EB2"
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 0,
                                                        width: "100%",
                                                        bottom: 0,
                                                        textAlign: "center",
                                                        backgroundColor:
                                                            "f5bf34",
                                                    }}
                                                >{`Избранное`}</Tag>
                                            )}
                                        </div>
                                        <Tag
                                            color="#DE1EB2"
                                            style={{
                                                opacity: 0.85,
                                                margin: 5,
                                                textAlign: "center",
                                            }}
                                        >{`Просмотрено ${series.watchedEpisode} из ${series.lastEpisode}`}</Tag>
                                    </Flex>
                                }
                            >
                                {series.imagePath === "" && (
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
                            </Card>
                        </Link>
                    </Popover>

                    <Title
                        level={5}
                        className="cardTitle"
                        style={{
                            maxWidth: 200,
                            marginTop: "10px",
                        }}
                    >
                        <Link href={`/series/${series.id}`}>
                            {series.title}
                        </Link>
                    </Title>
                </Col>
            ))}
        </Row>
    );
};
