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
    UndoOutlined,
    SearchOutlined,
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
import { Dispatch, SetStateAction, useState } from "react";
import { ShikimoriRequest } from "../services/shikimori";
type MenuItem = Required<MenuProps>["items"][number];
const date = dayjs();
interface Props {
    genres: Genre[] | any;
    open: boolean;
    onClose: () => void;
    setRequest: Dispatch<SetStateAction<ShikimoriRequest>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
}
function AnimeParamsMenu({
    genres,
    open,
    page,
    setPage,
    onClose,
    setRequest,
}: Props) {
    const { Title, Text } = Typography;

    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<any[]>([]);
    const [kind, setKind] = useState<any[]>([]);
    const [genre, setGenre] = useState<any[]>([]);
    const [audience, setAudience] = useState<any[]>([]);
    const [theme, setTheme] = useState<any[]>([]);
    const [season, setSeason] = useState<string>("");
    const [order, setOrder] = useState<string>("ranked");
    const [safe, setSafe] = useState<boolean>(false);

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
    const handleCheckboxChange = (_: any, allValues: any) => {
        if (query) {
            setOrder("ranked");
        }
        setRequest({
            page: page,
            name: query,
            season: season,
            status: status.toString(),
            kind: kind.toString(),
            genre: genre.concat(audience).concat(theme).toString(),
            order: order,
            censored: safe,
        });
    };
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
            onClose={onClose}
            open={open}
        >
            <Form onValuesChange={handleCheckboxChange}>
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Безопасный поиск</Title>
                    <Flex>
                        <Descriptions items={items}></Descriptions>
                        <Tooltip title={safe ? "Включить" : "Выключить"}>
                            <Form.Item name={"safe"}>
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
                            </Form.Item>
                        </Tooltip>
                    </Flex>
                </Flex>
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Найти аниме</Title>
                    <Form.Item name={"query"}>
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
                    </Form.Item>
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
                                <Form.Item name={"date"}>
                                    <DatePicker
                                        onChange={(date) => {
                                            if (date) {
                                                setSeason(
                                                    date
                                                        .format("YYYY")
                                                        .toString()
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
                                </Form.Item>
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
