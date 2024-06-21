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
    Typography,
} from "antd";
import Link from "next/link";
import {
    FileImageOutlined,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import AnimePopover from "./AnimePopover";
import AbsoluteImage from "./AbsoluteImage";

interface Props {
    animes: Anime[];
}
export const Animes = ({ animes }: Props) => {
    const { Title } = Typography;
    return (
        <Row gutter={[25, 25]} justify="center">
            {animes.map((animes: Anime) => (
                <Col key={`anime_${animes.id}`}>
                    <Link href={`/shikimori/${animes.id}`}>
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
                            <Card
                                style={{
                                    width: 200,
                                    height: 300,
                                    borderRadius: 5,
                                }}
                                cover={
                                    <Flex justify={"end"}>
                                        <AbsoluteImage
                                            src={animes.pictureUrl}
                                            zIndex={1}
                                        />
                                        <Tag
                                            color="#DE1EB2"
                                            style={{
                                                display: "inline-block",
                                                margin: 1,
                                            }}
                                        >
                                            {new Date(
                                                animes.startDate
                                            ).getFullYear()}
                                        </Tag>
                                    </Flex>
                                }
                            >
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
                            </Card>
                        </Popover>
                    </Link>

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
                        <Tag>{animes.kind}</Tag>
                        <Tag>{animes.status}</Tag>
                        <Tag>{`${animes.episodes} эп.`}</Tag>
                    </Flex>
                </Col>
            ))}
        </Row>
    );
};
