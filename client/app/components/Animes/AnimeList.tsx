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
    SearchOutlined,
    StarOutlined,
} from "@ant-design/icons";
import AbsoluteImage from "../AbsoluteImage";
import AnimeParamsMenu from "../AnimeParamsMenu";
import { getAnimesByParams, getGenres } from "../../services/shikimori";
import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { EmptyView } from "../EmptyView";
import PageNavigator from "../PageNavigator";

import styles from "./component.module.css";
import { defaultValues, SeriesAnime } from "@/app/Models/Anime/SeriesAnime";
import { ShikimoriRequest } from "@/app/Models/Requests/ShikimoriRequest";
import AnimeDetailPopover from "../Popovers/AnimeDetailPopover";

const { Text } = Typography;
interface Props {
    userPath?: string;
}

const AnimeList = ({ userPath }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const createQueryString = useMemo(
        () => (query: any) => {
            const params = new URLSearchParams(searchParams);
            for (const [name, value] of Object.entries(query)) {
                if (name && value) {
                    params.set(name, String(value));
                } else {
                    params.delete(name);
                }
            }

            return params.toString();
        },
        [searchParams]
    );

    const [genres, setGenres] = useState<Genre[] | any>([]);
    const path = userPath ? userPath + usePathname() : usePathname();

    const [page, setPage] = useState<number>(
        searchParams.get("page") != null ? Number(searchParams.get("page")) : 1
    );
    const [request, setRequest] = useState<ShikimoriRequest>({
        page: page,
    });

    function scrollTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const changePage = useCallback(
        (page: number) => {
            if (page === 0) {
                setPage(1);
            } else {
                setPage(page);
            }
            request.page = page;
            updateSearchParams({ page: page });
            scrollTop();
        },
        [page]
    );

    const getAnimesPost = async (url: string) => {
        const data: SeriesAnime[] = await getAnimesByParams(url);
        const list = await getGenres();
        setGenres(list);
        if (data.length === 0) {
            const prevPage = page - 1;
            changePage(prevPage);
        }
        return data;
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage); // Обновляем состояние
        updateSearchParams({ page: newPage }); // Обновляем URL
    };
    const {
        data = Array.from({ length: 15 }).map((_, i) => defaultValues),
        isLoading,
    } = useSWR(`${path}?${createQueryString(request)}`, getAnimesPost, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    const updateSearchParams = useCallback(
        (newQuery: any) => {
            const newQueryString = createQueryString(newQuery);
            router.push(`${path}?${newQueryString}`, { scroll: false }); // Обновляем URL
        },
        [createQueryString, router, path]
    );

    const ListBranches = () => {
        return (
            <Skeleton
                active
                title={{ style: { width: "100%" } }}
                paragraph={false}
                loading={isLoading}
            >
                <PageNavigator
                    nextButtonDisable={data.length < 22}
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
            renderEmpty={() => (
                <EmptyView text="По вашему запросу ничего не найдено" />
            )}
        >
            <List
                className="centered-list"
                header={data.length > 0 && <ListBranches />}
                footer={data.length > 0 && <ListBranches />}
                grid={{
                    gutter: 30,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data.slice(0, -1)}
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
                                                    {animes.startDate}
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
            <AnimeParamsMenu
                genres={genres}
                open={isOpen}
                onClose={toggleOpen}
                setRequest={setRequest}
                setPage={handlePageChange}
            />
            <FloatButton.Group style={{ right: 0, margin: 10, bottom: 32 }}>
                <FloatButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={toggleOpen}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </ConfigProvider>
    );
};

export default AnimeList;
