import Card from "antd/es/card/Card";
import {
    Badge,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    FloatButton,
    List,
    Popover,
    Row,
    Skeleton,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import Link from "next/link";
import {
    FireOutlined,
    HeartFilled,
    HeartOutlined,
    StarOutlined,
} from "@ant-design/icons";
import AbsoluteImage from "../AbsoluteImage";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { EmptyView } from "../EmptyView";
import PageNavigator from "../PageNavigator";
import styles from "./component.module.css";
import {
    defaultSeriesAnimeValues as defaultValues,
    SeriesAnime,
} from "@/app/Models/Anime/SeriesAnime";
import AnimeDetailPopover from "../Popovers/AnimeDetailPopover";
import { get } from "@/app/api/httpClient";

const { Text } = Typography;

interface Props {
    myList: string;
    userName: string;
    color?: string;
}
const UsersAnimeList = ({ myList, userName, color }: Props) => {
    const [page, setPage] = useState<number>(1);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const createQueryString = useMemo(
        () => (query: any) => {
            const params = new URLSearchParams();
            for (const [name, value] of Object.entries(query)) {
                if (value !== null && value !== undefined) {
                    params.set(name, String(value));
                }
            }
            return params.toString();
        },
        []
    );
    function scrollTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const changePage = useCallback((newPage: number) => {
        if (newPage === 0) {
            setPage(1);
        } else {
            setPage(newPage);
        }
        scrollTop();
    }, []);

    const getAnimesPost = async (url: string) => {
        const data: SeriesAnime[] = await get(url);
        return data;
    };

    const resetPage = useCallback(() => {
        setPage(1);
    }, [myList]);

    useEffect(() => {
        resetPage();
    }, [resetPage]);

    const {
        data = Array.from({ length: 14 }).map((_, i) => defaultValues),
        isLoading,
    } = useSWR(
        () => {
            const query = { myList, isFavorite };
            const queryString = createQueryString(query);
            return `/series/${userName}/list/${page}?${queryString}`;
        },
        getAnimesPost,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const ListBranches = () => {
        return (
            <Skeleton
                active
                className="width-100"
                paragraph={false}
                loading={isLoading}
            >
                <PageNavigator
                    nextButtonDisable={data.length < 2}
                    onFirstButtonCLick={() => changePage(1)}
                    onPrevButtonCLick={() => changePage(page - 1)}
                    onNextButtonCLick={() => changePage(page + 1)}
                    page={page}
                />
            </Skeleton>
        );
    };

    return (
        <ConfigProvider
            theme={{
                components: color
                    ? {
                          FloatButton: {
                              colorPrimary: color,
                              colorPrimaryHover: color,
                              colorFillContent: color,
                          },
                      }
                    : {},
            }}
            renderEmpty={() => (
                <EmptyView text="По вашему запросу ничего не найдено" />
            )}
        >
            <List
                className={styles["animes-list"]}
                header={data.length > 0 && <ListBranches />}
                footer={data.length > 7 ? <ListBranches /> : []}
                grid={{
                    gutter: 30,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data.length === 2 ? data.slice(0, -1) : data}
                renderItem={(animes: SeriesAnime) => (
                    <List.Item>
                        <Skeleton
                            className={"flex-column"}
                            loading={isLoading}
                            active
                            style={{ gap: 10 }}
                            avatar={{
                                shape: "square",
                                className: styles["anime-skeleton-image"],
                            }}
                            paragraph={{ rows: 2 }}
                            title={false}
                        >
                            <Popover
                                rootClassName="popover"
                                trigger={"hover"}
                                mouseEnterDelay={1}
                                mouseLeaveDelay={0.2}
                                placement="bottomLeft"
                                arrow={false}
                                content={
                                    <AnimeDetailPopover
                                        anime={animes}
                                        isOpen={false}
                                    />
                                }
                            >
                                <Link href={`/shikimori/${animes.id}`}>
                                    <Badge.Ribbon
                                        color={color}
                                        text={
                                            <Flex
                                                justify="center"
                                                align="center"
                                            >
                                                <Flex
                                                    gap={3}
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <StarOutlined
                                                        style={{ fontSize: 11 }}
                                                    />
                                                    <Text
                                                        className={
                                                            styles["cover-text"]
                                                        }
                                                    >
                                                        {animes.score}
                                                    </Text>
                                                </Flex>
                                                <Divider
                                                    type="vertical"
                                                    style={{ top: 0 }}
                                                />
                                                <Text
                                                    className={
                                                        styles["cover-text"]
                                                    }
                                                >
                                                    {new Date(
                                                        animes.startDate
                                                    ).getFullYear()}
                                                </Text>
                                            </Flex>
                                        }
                                    >
                                        <Card
                                            className={styles["anime-card"]}
                                            bordered={false}
                                            cover={
                                                <AbsoluteImage
                                                    src={animes.pictureUrl}
                                                    zIndex={0}
                                                >
                                                    {animes.categoryId > 0 && (
                                                        <Tag
                                                            className={
                                                                styles[
                                                                    "category-tag"
                                                                ]
                                                            }
                                                            color={
                                                                animes.categoryColor
                                                            }
                                                            bordered={false}
                                                        >
                                                            <Text
                                                                className={
                                                                    styles[
                                                                        "cover-text"
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    animes.categoryName
                                                                }
                                                            </Text>
                                                        </Tag>
                                                    )}
                                                </AbsoluteImage>
                                            }
                                        ></Card>
                                    </Badge.Ribbon>
                                </Link>
                            </Popover>
                            <Link
                                className="title-link"
                                href={`/shikimori/${animes.id}`}
                            >
                                {animes.title}
                            </Link>
                            <Row
                                gutter={[0, 5]}
                                style={{ justifyContent: "start" }}
                            >
                                {animes.isFavorite && (
                                    <Col>
                                        <Tooltip
                                            title={"В избранном"}
                                            trigger={"hover"}
                                        >
                                            <Tag color="cyan">
                                                <HeartFilled />
                                            </Tag>
                                        </Tooltip>
                                    </Col>
                                )}
                                <Col>
                                    {animes.status.length > 6 ? (
                                        <Tag
                                            className="tag"
                                            color="orange"
                                            icon={<FireOutlined />}
                                        >
                                            {animes.status}
                                        </Tag>
                                    ) : (
                                        <Tag className="tag">
                                            {animes.status}
                                        </Tag>
                                    )}
                                </Col>
                                <Col>
                                    <Tag className="tag">{animes.kind}</Tag>
                                </Col>
                                <Col>
                                    {animes.kind === "Фильм" && (
                                        <Tag className="tag">{`${animes.duration} мин.`}</Tag>
                                    )}
                                    {animes.kind !== "Фильм" && (
                                        <Tag className="tag">{`${animes.episodes} эп.`}</Tag>
                                    )}
                                </Col>
                            </Row>
                        </Skeleton>
                    </List.Item>
                )}
            />

            <FloatButton.Group style={{ right: 0, margin: 10, bottom: 32 }}>
                <FloatButton
                    tooltip="Только избранные"
                    type={isFavorite ? "primary" : "default"}
                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleFavorite}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </ConfigProvider>
    );
};

export default UsersAnimeList;
