import Card from "antd/es/card/Card";
import {
    Button,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    FloatButton,
    List,
    Popover,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import Link from "next/link";
import {
    DoubleLeftOutlined,
    FireOutlined,
    HeartFilled,
    LeftOutlined,
    RightOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import AnimePopover from "./AnimePopover";
import AbsoluteImage from "./AbsoluteImage";
import AnimeParamsMenu from "./AnimeParamsMenu";
import {
    getAnimesByParams,
    getGenres,
    ShikimoriRequest,
} from "../services/shikimori";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";
import { EmptyView } from "./EmptyView";
import PageNavigator from "./PageNavigator";

interface Props {
    userPath?: string;
}

export const Animes = ({ userPath }: Props) => {
    const customizeRenderEmpty = () => (
        <EmptyView text="По вашему запросу ничего не найдено" />
    );

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

    const [page, setPage] = useState<number | any>(
        searchParams.get("page") != null ? searchParams.get("page") : 1
    );
    const [request, setRequest] = useState<ShikimoriRequest>({
        page: page,
        name: "",
        season: "",
        status: "",
        kind: "",
        genre: "",
        order: "ranked",
        censored: true,
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
    const nextPage = () => {
        setPage(Number(page) + 1);
        request.page = Number(page) + 1;
        scrollTop();
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(Number(page) - 1);
            request.page = Number(page) - 1;
            scrollTop();
        }
    };

    const firstPage = () => {
        setPage(1);
        request.page = 1;
        scrollTop();
    };
    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };

    const getAnimesPost = async (url: string) => {
        const data: SeriesAnime[] = await getAnimesByParams(url);
        const list = await getGenres();
        setGenres(list);
        if (data.length === 0) {
            prevPage();
        }
        return data;
    };
    const { data = [], isLoading } = useSWR(
        `${path}?${createQueryString(request)}`,
        getAnimesPost,
        {
            // Опции для useSWR
            revalidateOnFocus: false, // Отключить обновление при фокусе
            revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
        }
    );

    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <List
                header={
                    !isLoading && (
                        <PageNavigator
                            nextButtonDisable={data.length < 28}
                            onFirstButtonCLick={firstPage}
                            onPrevButtonCLick={prevPage}
                            onNextButtonCLick={nextPage}
                            page={page}
                        />
                    )
                }
                footer={
                    !isLoading &&
                    data.length === 28 && (
                        <PageNavigator
                            nextButtonDisable={false}
                            onFirstButtonCLick={firstPage}
                            onPrevButtonCLick={prevPage}
                            onNextButtonCLick={nextPage}
                            page={page}
                        />
                    )
                }
                loading={{
                    spinning: isLoading,
                    size: "large",
                    style: { height: "100vh" },
                }}
                className="animes-list"
                grid={{
                    gutter: 30,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data}
                renderItem={(animes: SeriesAnime) => (
                    <List.Item>
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
                        <Row
                            gutter={[0, 5]}
                            style={{ justifyContent: "start" }}
                        >
                            <Col>
                                {animes.status.length > 6 ? (
                                    <Tag
                                        color="orange"
                                        icon={<FireOutlined />}
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {animes.status}
                                    </Tag>
                                ) : (
                                    <Tag
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {animes.status}
                                    </Tag>
                                )}
                            </Col>{" "}
                            <Col>
                                <Tag style={{ fontSize: 11, fontWeight: 500 }}>
                                    {animes.kind}
                                </Tag>
                            </Col>
                            <Col>
                                {animes.kind === "Фильм" && (
                                    <Tag
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                    >{`${animes.duration} мин.`}</Tag>
                                )}
                                {animes.kind !== "Фильм" && (
                                    <Tag
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                    >{`${animes.episodes} эп.`}</Tag>
                                )}
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
            <AnimeParamsMenu
                genres={genres}
                open={isOpen}
                onClose={toggleOpen}
                setRequest={setRequest}
                setPage={setPage}
            />
            <FloatButton.Group
                style={
                    data.length < 5
                        ? { display: "none" }
                        : { right: 0, margin: 10, bottom: 32 }
                }
            >
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
