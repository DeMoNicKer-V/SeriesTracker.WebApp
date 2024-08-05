import Card from "antd/es/card/Card";
import { Flex, List, Popover, Tag, Typography } from "antd";
import Link from "next/link";
import {
    FileImageOutlined,
    EllipsisOutlined,
    EditOutlined,
    BookOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import AnimePopover from "./AnimePopover";
import AbsoluteImage from "./AbsoluteImage";
import SeriesPopover from "./SeriesPopover";

interface Props {
    series: Series[];
}
export const Series = ({ series }: Props) => {
    const { Title } = Typography;
    return (
        <List
            style={{ justifyContent: "center", padding: 10 }}
            grid={{
                gutter: 15,
                xs: 2,
                sm: 3,
                md: 4,
                lg: 5,
                xl: 6,
                xxl: 7,
            }}
            dataSource={series}
            renderItem={(series: Series) => (
                <List.Item>
                    <Popover
                        trigger={"hover"}
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.2}
                        placement="bottomLeft"
                        arrow={false}
                        content={<SeriesPopover series={series} />}
                    >
                        <Link href={`/shikimori/${series.animeId}`}>
                            <Card
                                style={{
                                    maxHeight: 300,
                                    maxWidth: 200,
                                    minHeight: "auto",
                                    minWidth: "auto",
                                    aspectRatio: "auto 6/8",
                                    borderRadius: 5,
                                }}
                                cover={
                                    <Flex justify={"end"}>
                                        <AbsoluteImage
                                            src={series.pictureUrl}
                                            zIndex={0}
                                        />
                                        <Tag
                                            color="#DE1EB2"
                                            style={{
                                                display: "inline-block",
                                                margin: 5,
                                            }}
                                        >
                                            {new Date(
                                                series.startDate
                                            ).getFullYear()}
                                        </Tag>
                                    </Flex>
                                }
                            ></Card>
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
                        <Link href={`/shikimori/${series.animeId}`}>
                            {series.title}
                        </Link>
                    </Title>
                    <Flex>
                        <Tag>{series.kind}</Tag>
                        <Tag>{series.status}</Tag>
                        <Tag>{`${series.episodes} эп.`}</Tag>
                        {series.isFavorite && (
                            <Tag color="gold">
                                <BookOutlined />
                            </Tag>
                        )}
                    </Flex>
                </List.Item>
            )}
        />
    );
};
