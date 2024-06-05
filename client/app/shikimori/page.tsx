"use client";
import { useEffect, useState } from "react";
import { Animes } from "../components/Animes";
import { getAnimes, getGenres } from "../services/shikimori";
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
    MailOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
export default function ShikimoriPage() {
    type MenuItem = Required<MenuProps>["items"][number];
    const options2: SelectProps["options"] = [
        { label: "Анонс", value: "anons" },
        { label: "Онгоинг", value: "ongoing" },
        { label: "Вышло", value: "released" },
    ];
    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[] | any>([]);
    const [genres, setGenres] = useState<Genre[] | any>([]);

    const getSeries = async (page: number) => {
        const animes = await getAnimes(page);
        setAnimes(animes);
    };

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    const [form] = Form.useForm();
    useEffect(() => {
        getGenresList();
        getSeries(1);
    }, []);
    const options: SelectProps["options"] = [];

    const options3: SelectProps["options"] = [];
    for (let index = 0; index < genres.length; index++) {
        options?.push({
            label: genres[index].russian,
            value: genres[index].russian,
            key: genres[index].id,
        });
    }
    const date = dayjs();
    const [selectedTags, setSelectedTags] = useState<Genre[]>([]);
    const handleChange = (genre: Genre, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, genre]
            : selectedTags.filter((t) => t.id !== genre.id);
        setSelectedTags(nextSelectedTags);
    };
    const onReset = () => {
        form.resetFields();
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
                    style: { cursor: "default" },
                    label: (
                        <DatePicker
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
                    style: { cursor: "default" },
                    label: (
                        <Select
                            placeholder="Статус"
                            maxTagCount={"responsive"}
                            style={{ width: "100%" }}
                            options={options2}
                        />
                    ),
                },
            ],
        },
        {
            key: "3",
            icon: <AppstoreOutlined />,
            label: "Возв. рейтинг",
            children: [
                {
                    key: "21",
                    disabled: true,
                    style: { cursor: "default" },
                    label: (
                        <Select
                            placeholder="Статус"
                            maxTagCount={"responsive"}
                            style={{ width: "100%" }}
                            options={options2}
                        />
                    ),
                },
            ],
        },
        {
            key: "4",
            icon: <AppstoreOutlined />,
            label: "Тип сериала",
            children: [
                {
                    key: "21",
                    disabled: true,
                    style: { cursor: "default" },
                    label: (
                        <Select
                            placeholder="Статус"
                            maxTagCount={"responsive"}
                            style={{ width: "100%" }}
                            options={options2}
                        />
                    ),
                },
            ],
        },
        {
            key: "5",
            icon: <SettingOutlined />,
            label: "Жанр",
            children: [
                {
                    style: { width: 400, cursor: "default" },
                    disabled: true,

                    key: "31",
                    label: (
                        <Select
                            placeholder="Найти кокретный"
                            maxTagCount={"responsive"}
                            maxCount={5}
                            mode="multiple"
                            style={{
                                width: "100%",
                            }}
                            options={options}
                        />
                    ),
                },
            ],
        },
        {
            key: "6",
            style: { cursor: "default" },
            disabled: true,

            label: <Divider type="vertical" />,
        },
        {
            key: "7",
            icon: <SettingOutlined />,
            style: { cursor: "default" },
            disabled: true,

            label: <Button type="text">Сбросить</Button>,
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

            <Row align={"middle"} justify={"center"}>
                <Col span={16}>
                    <div
                        style={{ zIndex: 1 }}
                        className={loading === true ? "loading" : ""}
                    >
                        <Input
                            placeholder="Введите для поиска"
                            suffix={<SearchOutlined />}
                            spellCheck={false}
                        />
                    </div>
                </Col>
            </Row>

            <Divider dashed style={{ margin: 15 }}></Divider>
            <Row
                gutter={[10, 10]}
                style={{ margin: 20 }}
                justify={"center"}
                align={"middle"}
            >
                <Menu
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    selectable={false}
                    multiple
                    mode="horizontal"
                    items={items}
                ></Menu>
            </Row>
            <Animes animes={animes} />
        </div>
    );
}
