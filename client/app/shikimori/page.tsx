"use client";
import { useEffect, useState } from "react";
import { Animes } from "../components/Animes";
import {
    ShikimoriRequest,
    getAnimes,
    getAnimesByParams,
    getGenres,
} from "../services/shikimori";
import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Divider,
    Flex,
    FloatButton,
    Form,
    Input,
    List,
    Menu,
    MenuProps,
    Radio,
    Row,
    Select,
    SelectProps,
    Space,
    Spin,
    Switch,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import {
    RightOutlined,
    LeftOutlined,
    PlusOutlined,
    SearchOutlined,
    AppstoreOutlined,
    FilterFilled,
    FilterOutlined,
    DoubleLeftOutlined,
    MailOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
export default function ShikimoriPage() {
    type MenuItem = Required<MenuProps>["items"][number];
    const statusOptions: SelectProps["options"] = [
        { label: "Онгоинг", value: "ongoing" },
        { label: "Вышло", value: "released" },
    ];

    const [inputFocus, setInputFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [genres, setGenres] = useState<Genre[] | any>([]);

    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [kind, setKind] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [season, setSeason] = useState<string>("");
    const [order, setOrder] = useState<string>("ranked");
    const [page, setPage] = useState<number>(1);

    const onClick: MenuProps["onSelect"] = (e) => {
        setQuery("");
        setPage(1);
        setOrder(e.key);
    };

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        getGenresList();
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
        if (query) {
            setOrder("ranked");
        }
        const req: ShikimoriRequest = {
            page: page,
            name: query,
            season: season,
            status: status,
            kind: kind,
            genre: genre,
            order: order,
        };

        const timer = setTimeout(() => {
            setLoading(true);
            setInputFocus(false);
            getAnimesPost(req);
        }, 1000);

        return () => clearTimeout(timer);
    }, [page, query, season, status, kind, genre, order]);

    const kindOptions: SelectProps["options"] = [
        { label: "TV-Сериал", value: "tv" },
        { label: "П/ф", value: "movie" },
        { label: "ONA", value: "ona" },
        { label: "OVA", value: "ova" },
        { label: "Спешл", value: "special" },
        { label: "TV-Спешл", value: "tv_special" },
    ];

    const genreOptions: SelectProps["options"] = [];
    for (let index = 0; index < genres.length; index++) {
        genreOptions?.push({
            label: genres[index].russian,
            value: genres[index].id,
            key: genres[index].id,
        });
    }
    const date = dayjs();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const valueChange = (value: any, key: string) => {
        const index = selectedItems.indexOf(key);
        console.log(index);
        if (!value) {
            selectedItems.splice(index, 1);
        } else {
            if (index === -1) {
                selectedItems.push(key);
            }
        }
        setPage(1);
    };

    const resetAllFields = () => {
        form.resetFields();
        setSelectedItems([]);
        setPage(1);
        setOrder("ranked");
        setQuery("");
        setStatus("");
        setKind("");
        setGenre("");
        setSeason("");
    };

    const onClear = (key: string) => {
        const index = selectedItems.indexOf(key);
        selectedItems.splice(index, 1);
    };
    const [form] = Form.useForm();
    const items: MenuItem[] = [
        {
            key: "0",
            style: { minWidth: 200, maxWidth: 500, flex: "1 1 auto" },
            label: (
                <div style={{ width: "100%" }}>
                    <Typography.Title
                        level={5}
                        className={
                            inputFocus ? "input-label focus" : "input-label"
                        }
                        style={{
                            position: "absolute",
                            zIndex: 1,
                            left: 20,
                            top: -15,
                            padding: 3,
                            fontSize: 18,
                            transform: "scale(.75)",
                        }}
                    >
                        Поиск
                    </Typography.Title>
                    <Input
                        disabled={loading}
                        onChange={(e: { target: { value: any } }) => {
                            setQuery(String(e.target.value));
                        }}
                        value={query}
                        suffix={<SearchOutlined />}
                        style={{
                            fontSize: 18,
                            background: "none",
                        }}
                        spellCheck={false}
                        onFocus={() => setInputFocus(true)}
                        onBlur={() => setInputFocus(false)}
                    />
                </div>
            ),
        },
        {
            key: "1",
            icon: <MailOutlined />,
            label: "Год выхода",
            children: [
                {
                    key: "11",
                    disabled: true,
                    style: { cursor: "default", margin: 10 },
                    label: (
                        <Form.Item name={"season"}>
                            <DatePicker
                                onChange={(date) => {
                                    if (date) {
                                        setSeason(
                                            date.format("YYYY").toString()
                                        );
                                    } else setSeason("");
                                    valueChange(date, "1");
                                }}
                                variant="borderless"
                                inputReadOnly
                                minDate={dayjs(1967)}
                                maxDate={date}
                                placeholder="Год выхода"
                                style={{ width: "100%" }}
                                picker="year"
                            />
                        </Form.Item>
                    ),
                },
            ],
        },
        {
            key: "2",
            icon: <AppstoreOutlined />,
            label: "Статус",
            children: [
                {
                    key: "21",
                    disabled: true,
                    style: { cursor: "default", margin: 10 },
                    label: (
                        <Form.Item name={"status"}>
                            <Select
                                allowClear
                                onChange={(value) => {
                                    if (value) {
                                        setStatus(value.toString());
                                    } else setStatus("");
                                    valueChange(value, "2");
                                }}
                                variant="borderless"
                                placeholder="Статус"
                                maxTagCount={"responsive"}
                                style={{ width: "100%" }}
                                options={statusOptions}
                            />
                        </Form.Item>
                    ),
                },
            ],
        },

        {
            key: "3",
            icon: <AppstoreOutlined />,
            label: "Тип",
            children: [
                {
                    key: "31",
                    disabled: true,
                    style: { cursor: "default", margin: 10 },
                    label: (
                        <Form.Item name={"kind"}>
                            <Select
                                allowClear
                                onChange={(value) => {
                                    if (value) {
                                        setKind(value.toString());
                                    } else setKind("");
                                    valueChange(value, "3");
                                }}
                                variant="borderless"
                                placeholder="Тип"
                                maxTagCount={"responsive"}
                                style={{ width: "100%" }}
                                options={kindOptions}
                            />
                        </Form.Item>
                    ),
                },
            ],
        },
        {
            key: "4",
            icon: <SettingOutlined />,
            label: "Жанр",
            children: [
                {
                    style: { width: 400, cursor: "default", margin: 10 },
                    disabled: true,
                    key: "41",
                    label: (
                        <Form.Item name={"genre"}>
                            <Select
                                onClear={() => {
                                    onClear("4");
                                }}
                                allowClear
                                onChange={(value) => {
                                    if (value) {
                                        setGenre(value.toString());
                                    } else setGenre("");
                                    valueChange(value.toString(), "4");
                                }}
                                variant="borderless"
                                placeholder="Выберите жанры (макс. 5)"
                                maxTagCount={"responsive"}
                                maxCount={5}
                                mode="multiple"
                                style={{
                                    width: "100%",
                                }}
                                options={genreOptions}
                            />
                        </Form.Item>
                    ),
                },
            ],
        },
        {
            key: "5",
            style: { cursor: "default" },
            disabled: true,

            label: <Divider type="vertical" />,
        },
        {
            key: "6",

            style: { cursor: "default" },

            label: (
                <Button
                    disabled={loading}
                    onClick={resetAllFields}
                    icon={<SettingOutlined />}
                    type="link"
                >
                    Сбросить
                </Button>
            ),
        },
    ];

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const items2: MenuItem[] = [
        {
            style: { marginLeft: "auto" },
            label: "По рейтингу",
            key: "ranked",
            icon: <SettingOutlined />,
        },
        {
            label: "По популярности",
            key: "popularity",
            icon: <SettingOutlined />,
        },
        {
            label: "По алфавиту",
            key: "name",
            icon: <SettingOutlined />,
        },
        {
            label: "По дате выхода",
            key: "aired_on",
            icon: <SettingOutlined />,
        },
        {
            style: {
                cursor: "default",
                padding: 0,
            },
            key: "prev_next",
            disabled: true,
            label: (
                <Space split={<Divider type="vertical" />}>
                    <Button
                        onClick={prePage}
                        disabled={page <= 1 || loading}
                        size="small"
                        icon={<LeftOutlined />}
                    >
                        Назад
                    </Button>
                    <Button
                        disabled={loading}
                        size="small"
                        iconPosition="end"
                        icon={<RightOutlined />}
                        onClick={nextPage}
                    >
                        Вперед
                    </Button>
                </Space>
            ),
        },
    ];

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
            <Row justify={"center"} align={"middle"}>
                <Col span={18}>
                    <Form form={form}>
                        <Menu
                            disabled={loading}
                            selectedKeys={selectedItems}
                            triggerSubMenuAction={"click"}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: !collapsed ? "0" : "1",
                                transition: "all .2s",
                                visibility: !collapsed ? "hidden" : "visible",
                                padding: 15,
                                borderRadius: 10,
                            }}
                            selectable={false}
                            multiple
                            mode="horizontal"
                            items={items}
                        ></Menu>
                    </Form>
                </Col>
            </Row>

            <Row
                align={"middle"}
                justify={"center"}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: !collapsed ? -60 : 30,
                    transition: "all .2s",
                }}
            >
                <Col span={12}>
                    <Flex gap={5}>
                        <Typography.Title style={{ margin: 0 }} level={3}>
                            Shikimori.One
                        </Typography.Title>
                        <Button
                            disabled={loading}
                            type="primary"
                            shape="circle"
                            ghost={!collapsed}
                            onClick={() => toggleCollapsed()}
                            icon={<SearchOutlined />}
                        ></Button>
                    </Flex>

                    <Flex justify="start">
                        {page > 1 && (
                            <Tooltip title={"В начало"}>
                                <Button
                                    size="small"
                                    type="link"
                                    onClick={firstPage}
                                    icon={<DoubleLeftOutlined />}
                                />
                            </Tooltip>
                        )}
                        <Tag
                            style={{
                                cursor: "default",
                                marginLeft: page <= 1 ? 0 : 5,
                                transition: "all .2s",
                            }}
                        >{`Страница: ${page}`}</Tag>
                    </Flex>
                </Col>
                <Col span={12}>
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
                            items={items2}
                            mode="horizontal"
                        />
                    </ConfigProvider>
                </Col>
            </Row>
            <Divider />
            {!loading && <Animes animes={animes} />}
        </div>
    );
}
