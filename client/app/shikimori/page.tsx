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
    DatePicker,
    Divider,
    Form,
    Input,
    List,
    Menu,
    MenuProps,
    Row,
    Select,
    SelectProps,
    Space,
    Spin,
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
        { label: "Анонс", value: "anons" },
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
    const [request, setRequest] = useState<ShikimoriRequest | any>({
        page: 1,
        name: "",
        season: "",
        status: "",
        kind: "",
        genre: "",
    });

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        getGenresList();
        getAnimes(request);
    }, []);

    const getAnimes = async (req: ShikimoriRequest) => {
        const animes = await getAnimesByParams(req);
        setAnimes(animes);
    };

    useEffect(() => {
        const req: ShikimoriRequest = {
            page: 1,
            name: query,
            season: season,
            status: status,
            kind: kind,
            genre: genre,
        };

        const timer = setTimeout(() => {
            getAnimes(req);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query, season, status, kind, genre]);

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
        if (!value) {
            const index = selectedItems.indexOf(key);
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(key);
        }
    };

    const resetAllFields = (key: string) => {
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
                                setSeason(date.format("YYYY").toString());
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
                                setStatus(value.toString());
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
                                setKind(value.toString());
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
                                setGenre(value.toString());
                                valueChange(value.toString(), "4");
                            }}
                            variant="borderless"
                            placeholder="Выбирите жанры (макс. 5)"
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
                    onClick={() => resetAllFields}
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

            <Row align={"middle"} justify={"end"}>
                <Col span={12}>
                    <div
                        style={{ zIndex: 1 }}
                        className={loading === true ? "loading" : ""}
                    >
                        <Input
                            onChange={(e: { target: { value: any } }) => {
                                setQuery(String(e.target.value));
                            }}
                            placeholder="Введите для поиска"
                            suffix={<SearchOutlined />}
                            spellCheck={false}
                        />
                    </div>
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

                <Col
                    span={21}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: !collapsed ? -30 : 30,
                        transition: "all .2s",
                    }}
                >
                    <Animes animes={animes} />
                </Col>
            </Row>
        </div>
    );
}
