"use client";
import { useEffect, useState } from "react";
import { Animes } from "../components/Animes";
import {
    ShikimoriRequest,
    getAnimesByParams,
    getGenres,
} from "../services/shikimori";
import {
    Button,
    Col,
    Collapse,
    ConfigProvider,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    Divider,
    Drawer,
    Flex,
    FloatButton,
    Input,
    Menu,
    MenuProps,
    Row,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import {
    RightOutlined,
    UndoOutlined,
    LeftOutlined,
    SearchOutlined,
    InfoCircleOutlined,
    DoubleLeftOutlined,
    QuestionCircleOutlined,
    StarOutlined,
    FontColorsOutlined,
    TeamOutlined,
    CalendarOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import FilterItem from "../components/FilterItem";

///////////////////////////////////////////////////////
const { Text, Title } = Typography;
type MenuItem = Required<MenuProps>["items"][number];
const date = dayjs();

const statusOptions = [
    { russian: "Онгоинг", id: "ongoing" },
    { russian: "Вышло", id: "released" },
];

const kindOptions = [
    { russian: "TV-Сериал", id: "tv" },
    { russian: "П/ф", id: "movie" },
    { russian: "ONA", id: "ona" },
    { russian: "OVA", id: "ova" },
    { russian: "Спешл", id: "special" },
    { russian: "TV-Спешл", id: "tv_special" },
];
const sortMenuItems: MenuItem[] = [
    {
        style: { marginLeft: "auto" },
        label: "По рейтингу",
        key: "ranked",
        icon: <StarOutlined />,
    },
    {
        label: "По популярности",
        key: "popularity",
        icon: <TeamOutlined />,
    },
    {
        label: "По алфавиту",
        key: "name",
        icon: <FontColorsOutlined />,
    },
    {
        label: "По дате выхода",
        key: "aired_on",
        icon: <CalendarOutlined />,
    },
];
export default function ShikimoriPage() {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
    const [genres, setGenres] = useState<Genre[] | any>([]);

    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<any[]>([]);
    const [kind, setKind] = useState<any[]>([]);
    const [genre, setGenre] = useState<any[]>([]);
    const [audience, setAudience] = useState<any[]>([]);
    const [theme, setTheme] = useState<any[]>([]);
    const [season, setSeason] = useState<string>("");
    const [order, setOrder] = useState<string>("ranked");
    const [page, setPage] = useState<number>(1);
    const [safe, setSafe] = useState<boolean>(false);

    const onClick: MenuProps["onSelect"] = (e) => {
        setQuery("");
        setPage(1);
        setOrder(e.key);
    };
    const items: DescriptionsProps["items"] = [
        {
            label: "Состояние",
            children: (
                <Flex gap={5}>
                    {safe ? "Выключен" : "Включен"}
                    <Tooltip
                        trigger={"hover"}
                        title={
                            safe
                                ? "Рекомендуется в большинстве случаев"
                                : "Если вы ищете что-то определенное"
                        }
                    >
                        <QuestionCircleOutlined style={{ cursor: "help" }} />
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        return () => {
            getGenresList();
        };
    }, []);

    const getAnimesPost = async (req: ShikimoriRequest) => {
        const animes = await getAnimesByParams(req);
        setAnimes(animes);
        setLoading(false);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    const prePage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const firstPage = () => {
        setPage(1);
    };
    useEffect(() => {
        console.log(genre.toString() + audience.toString() + theme.toString());
        if (query) {
            setOrder("ranked");
        }

        const req: ShikimoriRequest = {
            page: page,
            name: query,
            season: season,
            status: status.toString(),
            kind: kind.toString(),
            genre: genre.concat(audience).concat(theme).toString(),
            order: order,
            censored: safe,
        };
        setLoading(true);
        const timer = setTimeout(() => {
            getAnimesPost(req);
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        page,
        query,
        season,
        status,
        kind,
        audience,
        genre,
        theme,
        order,
        safe,
    ]);

    const resetAllFields = () => {
        setPage(1);
        setOrder("ranked");
        setQuery("");
        setStatus([]);
        setKind([]);
        setGenre([]);
        setSeason("");
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container">
            <title>Series Tracker - Shikimori</title>
            <Spin
                size="large"
                spinning={loading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />

            <Typography.Title style={{ margin: 0 }} level={3}>
                Аниме
            </Typography.Title>

            <Flex justify="start">
                {page > 2 && (
                    <Tooltip title={"В начало"}>
                        <Button
                            disabled={loading}
                            size="small"
                            type="link"
                            onClick={firstPage}
                            icon={<DoubleLeftOutlined />}
                        />
                    </Tooltip>
                )}
                {page > 1 && (
                    <Tooltip title={"Назад"}>
                        <Button
                            disabled={loading}
                            size="small"
                            type="link"
                            onClick={prePage}
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
                {animes.length == 28 && (
                    <Tooltip title={"Дальше"}>
                        <Button
                            disabled={loading}
                            size="small"
                            type="link"
                            onClick={nextPage}
                            icon={<RightOutlined />}
                        />
                    </Tooltip>
                )}
            </Flex>
            <Divider />
            {Number(animes.length) <= 0 && loading === false && (
                <Row>
                    <Col span={16} offset={4}>
                        <Flex
                            className="emptyview"
                            justify="center"
                            align="middle"
                            gap={10}
                        >
                            <InfoCircleOutlined style={{ fontSize: 32 }} />
                            <span style={{ fontSize: 22 }}>
                                {"По вашему запросу ничего не найдено."}
                            </span>
                        </Flex>
                    </Col>
                </Row>
            )}
            {!loading && <Animes animes={animes} />}
            <Drawer
                style={{ opacity: 0.95 }}
                title={
                    <Flex align="center" justify="space-between">
                        <Title level={5}>{"Укажите критерии поиска"}</Title>
                        <Tooltip title={"Сбросить всё"}>
                            <Button
                                onClick={resetAllFields}
                                icon={<UndoOutlined />}
                                type="text"
                                shape="round"
                            ></Button>
                        </Tooltip>
                    </Flex>
                }
                size="large"
                onClose={() => setIsOpen(false)}
                open={isOpen}
            >
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Безопасный поиск</Title>
                    <Flex>
                        <Descriptions items={items}></Descriptions>
                        <Tooltip title={safe ? "Включить" : "Выключить"}>
                            <Button
                                danger={!safe}
                                onClick={() => {
                                    setSafe(!safe);
                                    resetAllFields();
                                }}
                                shape="circle"
                                size="small"
                                type="dashed"
                                icon={
                                    safe ? (
                                        <EyeOutlined />
                                    ) : (
                                        <EyeInvisibleOutlined />
                                    )
                                }
                            />
                        </Tooltip>
                    </Flex>
                </Flex>
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Найти аниме</Title>

                    <Input
                        allowClear
                        onChange={(e: { target: { value: any } }) => {
                            setQuery(String(e.target.value));
                        }}
                        value={query}
                        suffix={<SearchOutlined />}
                        style={{
                            fontSize: 16,
                            background: "none",
                        }}
                        spellCheck={false}
                    />
                </Flex>

                <Collapse
                    defaultActiveKey={["sort", "date", "kind", "status"]}
                    bordered={false}
                    items={[
                        {
                            key: "sort",
                            label: <Title level={5}>Сортировка</Title>,
                            children: (
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Menu: {
                                                itemBg: "transparent",
                                                darkItemBg: "transparent",
                                            },
                                        },
                                    }}
                                >
                                    <Menu
                                        disabled={loading}
                                        onSelect={onClick}
                                        selectedKeys={[order]}
                                        items={sortMenuItems}
                                        mode="vertical"
                                    />
                                </ConfigProvider>
                            ),
                        },
                        {
                            key: "date",
                            label: <Title level={5}>Год выхода</Title>,
                            children: (
                                <DatePicker
                                    onChange={(date) => {
                                        if (date) {
                                            setSeason(
                                                date.format("YYYY").toString()
                                            );
                                        } else setSeason("");
                                    }}
                                    variant="borderless"
                                    inputReadOnly
                                    minDate={dayjs(1967)}
                                    maxDate={date}
                                    placeholder="Укажите год выхода"
                                    style={{ width: "100%" }}
                                    picker="year"
                                />
                            ),
                        },
                        {
                            key: "status",
                            label: <Title level={5}>Статус</Title>,
                            children: (
                                <FilterItem
                                    value={status}
                                    targetValue={setStatus}
                                    dataSource={statusOptions}
                                    index="status"
                                />
                            ),
                        },
                        {
                            key: "kind",
                            label: <Title level={5}>Тип</Title>,
                            children: (
                                <FilterItem
                                    value={kind}
                                    targetValue={setKind}
                                    dataSource={kindOptions}
                                    index="kind"
                                />
                            ),
                        },
                        {
                            key: "demographic",
                            label: <Title level={5}>Аудитория</Title>,
                            children: (
                                <FilterItem
                                    value={audience}
                                    targetValue={setAudience}
                                    dataSource={genres.demographic}
                                    index="demographic"
                                />
                            ),
                        },
                        {
                            key: "genre",
                            label: <Title level={5}>Жанры</Title>,
                            children: (
                                <FilterItem
                                    value={genre}
                                    targetValue={setGenre}
                                    dataSource={genres.genre}
                                    index="genre"
                                />
                            ),
                        },
                        {
                            key: "theme",
                            label: <Title level={5}>Темы</Title>,
                            children: (
                                <FilterItem
                                    value={theme}
                                    targetValue={setTheme}
                                    dataSource={genres.theme}
                                    index="theme"
                                />
                            ),
                        },
                    ]}
                ></Collapse>
            </Drawer>
            <FloatButton.Group style={{ right: 0, margin: 10, bottom: 32 }}>
                <FloatButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={toggleOpen}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </div>
    );
}
