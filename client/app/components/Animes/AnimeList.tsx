import { getAnimes } from "@/app/api/animes/getAnime";
import { Anime, defaultAnimeValues } from "@/app/models/anime/Anime";
import { ShikimoriRequest } from "@/app/models/requests/ShikimoriRequest";
import {
    FireOutlined,
    HeartFilled,
    SearchOutlined,
    StarOutlined,
} from "@ant-design/icons";
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
import Card from "antd/es/card/Card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import AbsoluteImage from "../AbsoluteImage";
import AnimeParamsMenu from "../AnimeParamsMenu";
import { EmptyView } from "../EmptyView";
import PageNavigator from "../PageNavigator";
import AnimeDetailPopover from "../Popovers/AnimeDetailPopover";
import styles from "./component.module.css";

const { Text } = Typography;

const AnimeList = ({}) => {
    const searchParams = useSearchParams();
    const createQueryString = useMemo(
        () => (query: any) => {
            const params = new URLSearchParams(); // Создаем новый объект без начальных значений
            for (const [name, value] of Object.entries(query)) {
                if (name && value) {
                    params.set(name, String(value));
                } else {
                    params.delete(name); // Удаляем параметр, если value равен null или undefined
                }
            }
            return params.toString(); // Возвращаем только строку параметров
        },
        []
    );

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
            scrollTop();
        },
        [page]
    );

    const getAnimesPost = async (url: string) => {
        const data: Anime[] = await getAnimes(url);
        if (data.length === 0) {
            const prevPage = page - 1;
            changePage(prevPage);
        }
        return data;
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage); // Обновляем состояние
    };
    const {
        data = Array.from({ length: 14 }).map((_, i) => defaultAnimeValues),
        isLoading,
    } = useSWR(createQueryString(request), getAnimesPost, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
        errorRetryCount: 0,
    });

    const ListBranches = () => {
        return (
            <Skeleton
                active
                className="width-100"
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
                dataSource={data.length === 22 ? data.slice(0, -1) : data}
                renderItem={(animes: Anime) => (
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
                                <Link href={`/animes/${animes.id}`}>
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
                                href={`/animes/${animes.id}`}
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
                                            <Tag className="tag">
                                                <HeartFilled
                                                    style={{
                                                        color: "#ff69b4",
                                                    }}
                                                />
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
                                    {animes.kind.length === 5 ? (
                                        <Tag className="tag">{`${animes.duration} мин.`}</Tag>
                                    ) : (
                                        <Tag className="tag">{`${animes.episodes} эп.`}</Tag>
                                    )}
                                </Col>
                            </Row>
                        </Skeleton>
                    </List.Item>
                )}
            />
            <AnimeParamsMenu
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
