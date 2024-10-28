import Card from "antd/es/card/Card";
import {
    Button,
    Col,
    ConfigProvider,
    Divider,
    Flex,
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
    InfoCircleOutlined,
    LeftOutlined,
    RightOutlined,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { LongLeftArrow } from "../img/LongLeftArrow";
import { LongRightArrow } from "../img/LongRightArrow";

interface Props {
    isDrawerOpen: boolean;
    onDrawerClose: () => void;
    userPath?: string;
    disableBottomNav?: boolean;
}

export const Animes = ({
    isDrawerOpen,
    onDrawerClose,
    userPath,
    disableBottomNav,
}: Props) => {
    const customizeRenderEmpty = () => (
        <Flex className="emptyview" justify="center" align="middle" gap={10}>
            <InfoCircleOutlined style={{ fontSize: 32 }} />
            <span style={{ fontSize: 22 }}>
                {"По вашему запросу ничего не найдено."}
            </span>
        </Flex>
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
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
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

    const nextPage = () => {
        setPage(Number(page) + 1);
        request.page = Number(page) + 1;
    };

    const prePage = () => {
        if (page > 1) {
            setPage(Number(page) - 1);
            request.page = Number(page) - 1;
        }
    };

    const firstPage = () => {
        setPage(1);
        request.page = 1;
    };
    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        return () => {
            getGenresList();
        };
    }, []);

    const getAnimesPost = async (url: string) => {
        const data: SeriesAnime[] = await getAnimesByParams(url);
        if (data.length === 0) {
            prePage();
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
            <Flex justify="start">
                {page > 2 && (
                    <Tooltip title={"В начало"}>
                        <Button
                            onClick={firstPage}
                            disabled={isLoading}
                            size="small"
                            type="link"
                            icon={<DoubleLeftOutlined />}
                        />
                    </Tooltip>
                )}
                {page > 1 && (
                    <Tooltip title={"Назад"}>
                        <Button
                            onClick={prePage}
                            disabled={isLoading}
                            size="small"
                            type="link"
                            icon={<LeftOutlined />}
                        />
                    </Tooltip>
                )}
                <Tag
                    style={{
                        fontStyle: "italic",
                        cursor: "default",
                        marginLeft: page <= 1 ? 0 : 5,
                        transition: "all .2s",
                    }}
                >{`Страница: ${page}`}</Tag>

                <Tooltip
                    title={data.length === 28 ? "Дальше" : "Дальше страниц нет"}
                >
                    <Button
                        loading={isLoading}
                        onClick={nextPage}
                        disabled={data.length < 28}
                        size="small"
                        type="link"
                        icon={<RightOutlined />}
                    />
                </Tooltip>
            </Flex>

            <Divider />
            <List
                loading={{
                    spinning: isLoading,
                    size: "large",
                }}
                loadMore={
                    disableBottomNav
                        ? null
                        : !isLoading &&
                          data.length > 0 && (
                              <Flex
                                  style={{ marginInline: "30px" }}
                                  gap={20}
                                  justify="end"
                              >
                                  <Button
                                      disabled={page === 1}
                                      className="navigation-btn"
                                      icon={<DoubleLeftOutlined />}
                                      style={{ marginRight: "auto" }}
                                      type="primary"
                                      ghost
                                      onClick={firstPage}
                                      loading={isLoading}
                                  >
                                      В начало
                                  </Button>
                                  <Space.Compact>
                                      <Button
                                          disabled={page === 1}
                                          className="navigation-btn"
                                          icon={<LongLeftArrow />}
                                          type="primary"
                                          ghost
                                          onClick={prePage}
                                          loading={isLoading}
                                      >
                                          Назад
                                      </Button>
                                      <Button
                                          disabled={data.length < 28}
                                          className="navigation-btn"
                                          iconPosition="end"
                                          icon={<LongRightArrow />}
                                          type="primary"
                                          ghost
                                          onClick={nextPage}
                                          loading={isLoading}
                                      >
                                          Вперед
                                      </Button>
                                  </Space.Compact>
                              </Flex>
                          )
                }
                className="animes-list"
                grid={{
                    gutter: 15,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 7,
                }}
                dataSource={data}
                renderItem={(animes: SeriesAnime) => (
                    <List.Item
                        colStyle={{ maxWidth: 210, marginInline: "auto" }}
                    >
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
                        <Row
                            gutter={[0, 5]}
                            style={{ justifyContent: "space-between" }}
                        >
                            <Col>
                                <Tag style={{ fontSize: 11, fontWeight: 500 }}>
                                    {animes.kind}
                                </Tag>
                            </Col>
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
                open={isDrawerOpen}
                onClose={onDrawerClose}
                setRequest={setRequest}
                setPage={setPage}
            />
        </ConfigProvider>
    );
};
