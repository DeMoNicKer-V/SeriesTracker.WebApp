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
import AbsoluteImage from "./AbsoluteImage";

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
                                    <AbsoluteImage
                                        src={series.imagePath}
                                        zIndex={0}
                                    />
                                }
                            >
                                <Flex
                                    align="end"
                                    style={{
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                >
                                    <Tag
                                        color="#DE1EB2"
                                        style={{
                                            margin: 5,
                                            textAlign: "center",
                                        }}
                                    >{`Просмотрено ${series.watchedEpisode} из ${series.lastEpisode}`}</Tag>
                                    {series.isFavorite && (
                                        <Tag
                                            color="#DE1EB2"
                                            style={{
                                                textAlign: "center",
                                                margin: "auto 0px -1px 0px",
                                                width: "100%",
                                                borderBottomRightRadius: "5px",
                                                borderBottomLeftRadius: "5px",
                                                borderTopLeftRadius: "0px",
                                                borderTopRightRadius: "0px",
                                            }}
                                        >{`Избранное`}</Tag>
                                    )}
                                </Flex>
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
