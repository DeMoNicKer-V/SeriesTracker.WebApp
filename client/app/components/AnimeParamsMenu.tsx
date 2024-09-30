import {
    Button,
    Checkbox,
    CheckboxProps,
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
import CustomIconCheckbox from "./CustomIconCheckbox";
type MenuItem = Required<MenuProps>["items"][number];
type FieldType = {
    page: number;
    query: string;
    season: string;
    status: [];
    kind: [];
    audience: [];
    genre: [];
    theme: [];
    order: [];
    censored: boolean;
};
const date = dayjs();
interface Props {
    genres: Genre[] | any;
    open: boolean;
    onClose: () => void;
    setRequest: Dispatch<SetStateAction<ShikimoriRequest>>;
    setPage: Dispatch<SetStateAction<number>>;
    setOrder: Dispatch<SetStateAction<string>>;
    order: string;
}
function AnimeParamsMenu({
    genres,
    open,
    setPage,
    setOrder,
    order,
    onClose,
    setRequest,
}: Props) {
    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<string[]>([]);
    const [kind, setKind] = useState<string[]>([]);
    const [genre, setGenre] = useState<number[]>([]);
    const [audience, setAudience] = useState<number[]>([]);
    const [theme, setTheme] = useState<number[]>([]);
    const [season, setSeason] = useState<string>("");
    const [censored, setCensored] = useState<boolean>(true);

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
        form.resetFields();
    };
    const items: DescriptionsProps["items"] = [
        {
            label: "Состояние",
            children: (
                <Flex gap={5}>
                    {censored ? "Включен" : "Выключен"}
                    <Tooltip
                        trigger={"hover"}
                        title={
                            censored
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
    const handleCheckboxChange = (_: any, allValues: FieldType) => {
        if (query) {
            setOrder("ranked");
        }
        setPage(1);

        setRequest({
            name: allValues.query,
            season: allValues.season
                ? dayjs(allValues.season).format("YYYY")
                : "",
            status: status.toString(),
            kind: kind.toString(),
            genre: allValues.genre
                .concat(allValues.audience)
                .concat(allValues.theme)
                .toString(),
            censored: censored,
        });
    };
    const onChange: CheckboxProps["onChange"] = (e) => {
        setCensored(e.target.checked);
    };

    const handleSelect: MenuProps["onSelect"] = (e) => {
        setOrder(e.key);
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
            <Form
                initialValues={{
                    censored: true,
                    query: "",
                    kind: [],
                    status: [],
                    order: "ranked",
                    season: "",
                    genre: [],
                    demographic: [],
                    theme: [],
                }}
                form={form}
                onValuesChange={handleCheckboxChange}
            >
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Безопасный поиск</Title>
                    <Flex>
                        <Descriptions items={items}></Descriptions>
                        <Tooltip title={censored ? "Выключить" : "Включить"}>
                            <Form.Item
                                name={"censored"}
                                valuePropName="checked"
                            >
                                <Checkbox
                                    onChange={onChange}
                                    defaultChecked
                                    checked={censored}
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
                            onChange={(e: { target: { value: any } }) => {
                                setQuery(String(e.target.value));
                            }}
                            allowClear
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
                    defaultActiveKey={["sort", "season", "kind", "status"]}
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
                                        selectedKeys={[order]}
                                        onSelect={handleSelect}
                                        defaultSelectedKeys={["ranked"]}
                                        items={sortMenuItems}
                                        mode="vertical"
                                    />
                                </ConfigProvider>
                            ),
                        },
                        {
                            key: "season",
                            label: <Title level={5}>Год выхода</Title>,
                            children: (
                                <Form.Item name={"season"}>
                                    <DatePicker
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
                            forceRender: true,
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
                            forceRender: true,
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
                            forceRender: true,
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
