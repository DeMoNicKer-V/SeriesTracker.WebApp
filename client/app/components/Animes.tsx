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
                                    maxHeight: 310,
                                    maxWidth: 210,
                                    minHeight: "auto",
                                    minWidth: "auto",
                                    aspectRatio: "auto 8/11",
                                    borderRadius: 7,
                                }}
                                cover={
                                    <AbsoluteImage
                                        src={animes.pictureUrl}
                                        zIndex={0}
                                    >
                                        <Tag
                                            color="#DE1EB2"
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
                                        {animes.categoryId > 0 && (
                                            <Tag
                                                color={animes.categoryColor}
                                                bordered={false}
                                                style={{
                                                    fontSize: 14,
                                                    fontStyle: "italic",
                                                    textAlign: "center",
                                                    width: "100%",
                                                    padding: 0,
                                                    margin: 0,
                                                    borderRadius: "0",
                                                }}
                                            >
                                                {animes.categoryName}
                                            </Tag>
                                        )}
                                    </AbsoluteImage>
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
                        <Link href={`/shikimori/${animes.id}`}>
                            {animes.title}
                        </Link>
                    </Title>
                    <Flex>
                        <Tag className="anime_tag">{animes.kind}</Tag>
                        <Tag className="anime_tag">{animes.status}</Tag>
                        <Tag className="anime_tag">{`${animes.episodes} эп.`}</Tag>

                        {animes.isFavorite && (
                            <Tooltip title={"В избранном"} trigger={"hover"}>
                                <Tag color="pink">
                                    <HeartFilled />
                                </Tag>
                            </Tooltip>
                        )}
                    </Flex>
                </List.Item>
            )}
        />
    );
};
