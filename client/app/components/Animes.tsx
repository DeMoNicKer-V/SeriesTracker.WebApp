import Card from "antd/es/card/Card";
import { Flex, List, Popover, Tag, Tooltip, Typography } from "antd";
import Link from "next/link";
import {
    FileImageOutlined,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    HeartFilled,
    BookFilled,
} from "@ant-design/icons";
import AnimePopover from "./AnimePopover";
import AbsoluteImage from "./AbsoluteImage";

interface Props {
    animes: SeriesAnime[];
}
export const Animes = ({ animes }: Props) => {
    const { Title } = Typography;
    return (
        <List
            className="animes-list"
            grid={{
                gutter: 15,
                xs: 2,
                sm: 2,
                md: 4,
                lg: 5,
                xl: 6,
                xxl: 7,
            }}
            dataSource={animes}
            renderItem={(animes: SeriesAnime) => (
                <List.Item colStyle={{ maxWidth: 210, marginInline: "auto" }}>
                    <Popover
                        trigger={"hover"}
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.2}
                        placement="bottomLeft"
                        arrow={false}
                        content={
                            <AnimePopover animes={animes} isOpen={false} />
                        }
                    >
                        <Link href={`/shikimori/${animes.id}`}>
                            <Card
                                bordered={false}
                                style={{
                                    overflow: "hidden",
                                    maxHeight: 300,
                                    maxWidth: 200,
                                    minHeight: "auto",
                                    minWidth: "auto",
                                    aspectRatio: "auto 8/11",
                                }}
                                cover={
                                    <AbsoluteImage
                                        src={animes.pictureUrl}
                                        zIndex={0}
                                    >
                                        <Flex>
                                            <Tag
                                                color="magenta"
                                                style={{
                                                    width: "fit-content",
                                                    display: "inline-block",
                                                    margin: 5,
                                                }}
                                            >
                                                {new Date(
                                                    animes.startDate
                                                ).getFullYear()}
                                            </Tag>
                                            {animes.isFavorite && (
                                                <Tooltip
                                                    title={"В избранном"}
                                                    trigger={"hover"}
                                                >
                                                    <Tag
                                                        style={{
                                                            width: "fit-content",
                                                            display:
                                                                "inline-block",
                                                            margin: 5,
                                                        }}
                                                        color="magenta"
                                                    >
                                                        <HeartFilled />
                                                    </Tag>
                                                </Tooltip>
                                            )}
                                        </Flex>
                                        {animes.categoryId > 0 && (
                                            <Tag
                                                color={animes.categoryColor}
                                                bordered={false}
                                                style={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                    padding: 0,
                                                    margin: 0,
                                                    borderRadius: 0,
                                                }}
                                            >
                                                <Typography.Text
                                                    style={{
                                                        textShadow:
                                                            "1px 1px 2px black",
                                                    }}
                                                    strong
                                                >
                                                    {animes.categoryName}
                                                </Typography.Text>
                                            </Tag>
                                        )}
                                    </AbsoluteImage>
                                }
                            ></Card>
                        </Link>
                    </Popover>
                    <Link
                        className="title-link"
                        href={`/shikimori/${animes.id}`}
                    >
                        {animes.title}
                    </Link>
                    <Flex>
                        <Tag style={{ fontSize: 10 }}>{animes.kind}</Tag>
                        <Tag style={{ fontSize: 10 }}>{animes.status}</Tag>
                        <Tag
                            style={{ fontSize: 10 }}
                        >{`${animes.episodes} эп.`}</Tag>
                    </Flex>
                </List.Item>
            )}
        />
    );
};
