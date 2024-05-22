import Card from "antd/es/card/Card";
import ShortDescription from "./shortDescription";
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
    return (
        <Row gutter={[20, 25]} justify="center">
            {series.map((series: Series["item1"]) => (
                <Col>
                    <Link href={`/series/${series.id}`}>
                        <Popover
                            trigger={"hover"}
                            mouseEnterDelay={0.5}
                            mouseLeaveDelay={0.2}
                            placement="bottomLeft"
                            arrow={false}
                            content={
                                <ShortDescription
                                    series={series}
                                    isOpen={false}
                                />
                            }
                        >
                            <Card
                                style={{ width: 200, height: 300 }}
                                key={series.id}
                                cover={
                                    <Flex justify={"end"}>
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
                                        ></div>
                                        <Tag
                                            color="#DE1EB2"
                                            style={{
                                                display: "inline-block",
                                                margin: 0,
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
                        </Popover>
                    </Link>

                    <h2
                        className="cardTitle"
                        style={{
                            fontSize: 14,
                            maxWidth: 200,
                            marginTop: "10px",
                            flex: 1,
                        }}
                    >
                        <Link href={`/series/${series.id}`}>
                            {series.title}
                        </Link>
                    </h2>
                </Col>
            ))}
        </Row>
    );
};
