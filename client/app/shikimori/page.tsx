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

    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [genres, setGenres] = useState<Genre[] | any>([]);

    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [kind, setKind] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [season, setSeason] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const [current, setCurrent] = useState("ranked");

    const onClick: MenuProps["onSelect"] = (e) => {
        setCurrent(e.key);
    };

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        getGenresList();
    }, []);

    useEffect(() => {
        getAnimesFirst();
    }, [current]);

    const getAnimesPost = async (req: ShikimoriRequest) => {
        const animes = await getAnimesByParams(req);
        setAnimes(animes);
        setLoading(false);
    };

    const getAnimesFirst = async () => {
        const animes = await getAnimes(page, current);
        setAnimes(animes);
    };

    useEffect(() => {
        const req: ShikimoriRequest = {
            page: page,
            name: query,
            season: season,
            status: status,
            kind: kind,
            genre: genre,
        };

        setLoading(true);
        const timer = setTimeout(() => {
            getAnimesPost(req);
        }, 1000);

        return () => clearTimeout(timer);
    }, [page, query, season, status, kind, genre]);

    const kindOptions: SelectProps["options"] = [
        { label: "TV-Сериал", value: "tv" },
        { label: "П/ф", value: "movie" },
        { label: "ONA", value: "ona" },
        { label: "OVA", value: "ova" },
        { label: "Спешл", value: "special" },
        { label: "TV-Спешл", value: "tv_special" },
        { label: "Музыка", value: "music" },
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
        console.log("aaa");
        setPage(1);
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
    const items: MenuItem[] = [
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
                        <DatePicker
                            onChange={(date) => {
                                if (date) {
                                    setSeason(date.format("YYYY").toString());
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
                marginLeft: "auto",
            },
            key: "prev_next",
            disabled: true,
            label: (
                <Space split={<Divider type="vertical" />}>
                    <Button icon={<LeftOutlined />}>Назад</Button>
                    <Button icon={<RightOutlined />}>Вперед</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container">
            <title>Series Tracker - Shikimori</title>
            <Spin size="large" fullscreen spinning={loading} />

            <Row align={"middle"} justify={"end"}>
                <Col span={12}>
                    <Input
                        style={{ fontSize: 18, padding: 10 }}
                        onChange={(e: { target: { value: any } }) => {
                            setQuery(String(e.target.value));
                        }}
                        placeholder="Введите для поиска"
                        suffix={<SearchOutlined />}
                        spellCheck={false}
                    />
                </Col>
                <Col span={5}></Col>
                <Col span={1}>
                    <Button
                        icon={<FilterOutlined />}
                        type="link"
                        onClick={toggleCollapsed}
                        style={
                            collapsed
                                ? { backgroundColor: "#DE1EB2" }
                                : { backgroundColor: "transparent" }
                        }
                    ></Button>
                </Col>
            </Row>

            <Divider dashed style={{ margin: 15 }}></Divider>

            <Row justify={"center"} align={"middle"}>
                <Col span={10}>
                    <Menu
                        selectedKeys={selectedItems}
                        triggerSubMenuAction={"click"}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: !collapsed ? "0" : "1",
                            transition: "all .2s",
                            visibility: !collapsed ? "hidden" : "visible",
                        }}
                        selectable={false}
                        multiple
                        mode="horizontal"
                        items={items}
                    ></Menu>
                </Col>
            </Row>

            <Row justify={"center"} align={"middle"}>
                <Col
                    span={23}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: !collapsed ? -30 : 30,
                        transition: "all .2s",
                    }}
                >
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
                            onSelect={onClick}
                            style={{
                                marginBottom: 20,
                            }}
                            defaultSelectedKeys={[current]}
                            items={items2}
                            mode="horizontal"
                        />
                    </ConfigProvider>
                </Col>
                <Col>
                    <Animes animes={animes} />
                </Col>
            </Row>
        </div>
    );
}
