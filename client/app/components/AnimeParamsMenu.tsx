import {
    Button,
    Col,
    Collapse,
    ConfigProvider,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    Drawer,
    Flex,
    Form,
    Input,
    Menu,
    MenuProps,
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
import { useState } from "react";
type MenuItem = Required<MenuProps>["items"][number];
function AnimeParamsMenu({}) {
    const { Title, Text } = Typography;
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    const resetAllFields = () => {
        setPage(1);
        setOrder("ranked");
        setQuery("");
        setStatus([]);
        setKind([]);
        setGenre([]);
        setSeason("");
    };
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
    return (
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
            <Form>
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
            </Form>
        </Drawer>
    );
}

export default AnimeParamsMenu;
