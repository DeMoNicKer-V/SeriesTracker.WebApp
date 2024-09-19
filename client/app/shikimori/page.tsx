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
    Card,
    Checkbox,
    Col,
    Collapse,
    ConfigProvider,
    DatePicker,
    Divider,
    Drawer,
    Flex,
    FloatButton,
    Form,
    GetProp,
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
    CloseOutlined,
    SearchOutlined,
    AppstoreOutlined,
    FilterFilled,
    FilterOutlined,
    InfoCircleOutlined,
    DoubleLeftOutlined,
    MailOutlined,
    SettingOutlined,
    LikeOutlined,
    StarOutlined,
    FontColorsOutlined,
    TeamOutlined,
    EllipsisOutlined,
    CalendarOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import FilterItem from "../components/FilterItem";
export default function ShikimoriPage() {
    type MenuItem = Required<MenuProps>["items"][number];
    const statusOptions = [
        { russian: "Онгоинг", id: "ongoing" },
        { russian: "Вышло", id: "released" },
    ];

    const { Text, Title } = Typography;
    const [inputFocus, setInputFocus] = useState(false);
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
            status: status.toString(),
            kind: kind.toString(),
            genre: genre.toString().concat(status.toString(), theme.toString()),
            order: order,
            censored: safe,
        };
        setLoading(true);
        const timer = setTimeout(() => {
            getAnimesPost(req);
        }, 1000);

        return () => clearTimeout(timer);
    }, [page, query, season, status, kind, genre, order, safe]);

    useEffect(() => {
        resetAllFields();
    }, [safe]);

    const kindOptions = [
        { russian: "TV-Сериал", id: "tv" },
        { russian: "П/ф", id: "movie" },
        { russian: "ONA", id: "ona" },
        { russian: "OVA", id: "ova" },
        { russian: "Спешл", id: "special" },
        { russian: "TV-Спешл", id: "tv_special" },
    ];

    const date = dayjs();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const valueChange = (value: any, key: string) => {
        const index = selectedItems.indexOf(key);
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
        setStatus([]);
        setKind([]);
        setGenre([]);
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
                <div className="shikimoripage-input" style={{ width: "100%" }}>
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
                    icon={<CloseOutlined />}
                    type="link"
                >
                    Сбросить
                </Button>
            ),
        },
    ];
    const handleCheckboxChangeStatus: GetProp<
        typeof Checkbox.Group,
        "onChange"
    > = (checkedValues) => {
        setStatus(checkedValues);
    };
    const handleCheckboxChangeKind: GetProp<
        typeof Checkbox.Group,
        "onChange"
    > = (checkedValues) => {
        setKind(checkedValues);
    };
    const handleCheckboxChangeGenre: GetProp<
        typeof Checkbox.Group,
        "onChange"
    > = (checkedValues) => {
        setGenre(checkedValues);
    };
    const handleCheckboxChangeAudience: GetProp<
        typeof Checkbox.Group,
        "onChange"
    > = (checkedValues) => {
        setAudience(checkedValues);
    };
    const handleCheckboxChangeTheme: GetProp<
        typeof Checkbox.Group,
        "onChange"
    > = (checkedValues) => {
        setTheme(checkedValues);
    };

    const [collapsed, setCollapsed] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const items2: MenuItem[] = [
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
                <Col span={2}>
                    <Flex gap={5}>
                        <Typography.Title style={{ margin: 0 }} level={3}>
                            Аниме
                        </Typography.Title>
                        <Tooltip
                            title={
                                safe
                                    ? "Безопасный поиск выключен"
                                    : "Безопасный поиск включен"
                            }
                        >
                            <Button
                                danger={!safe}
                                onClick={() => setSafe(!safe)}
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
                </Col>
                <Col span={22}>
                    <Menu
                        disabled={loading}
                        selectedKeys={selectedItems}
                        triggerSubMenuAction={"click"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            padding: 15,
                            borderRadius: 10,
                        }}
                        selectable={false}
                        multiple
                        mode="horizontal"
                        items={items}
                    ></Menu>
                </Col>
            </Row>
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
            <Drawer size="large" onClose={() => setIsOpen(false)} open={isOpen}>
                <Form form={form}>
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
                                            items={items2}
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
                                                    date
                                                        .format("YYYY")
                                                        .toString()
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
                                ),
                            },
                            {
                                key: "status",
                                label: <Title level={5}>Статус</Title>,
                                children: (
                                    <FilterItem
                                        onChange={handleCheckboxChangeStatus}
                                        dataSource={statusOptions}
                                        key="status"
                                    />
                                ),
                            },
                            {
                                key: "kind",
                                label: <Title level={5}>Тип</Title>,
                                children: (
                                    <FilterItem
                                        onChange={handleCheckboxChangeKind}
                                        dataSource={kindOptions}
                                        key="kind"
                                    />
                                ),
                            },
                            {
                                key: "demographic",
                                label: <Title level={5}>Аудитория</Title>,
                                children: (
                                    <FilterItem
                                        onChange={handleCheckboxChangeAudience}
                                        dataSource={genres.demographic}
                                        key="demographic"
                                    />
                                ),
                            },
                            {
                                key: "genre",
                                label: <Title level={5}>Жанры</Title>,
                                children: (
                                    <FilterItem
                                        onChange={handleCheckboxChangeGenre}
                                        dataSource={genres.genre}
                                        key="genre"
                                    />
                                ),
                            },
                            {
                                key: "theme",
                                label: <Title level={5}>Темы</Title>,
                                children: (
                                    <FilterItem
                                        onChange={handleCheckboxChangeTheme}
                                        dataSource={genres.theme}
                                        key="theme"
                                    />
                                ),
                            },
                        ]}
                    ></Collapse>
                </Form>
            </Drawer>

            <FloatButton
                style={{ right: 32, bottom: 32 }}
                type="primary"
                icon={<FilterOutlined />}
                onClick={toggleOpen}
            />
        </div>
    );
}
