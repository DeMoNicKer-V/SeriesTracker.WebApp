import {
    Button,
    Checkbox,
    CheckboxProps,
    Collapse,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    Drawer,
    Flex,
    Form,
    Input,
    Segmented,
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
} from "@ant-design/icons";
import dayjs from "dayjs";
import FilterItem from "../components/FilterItem";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { ShikimoriRequest } from "../Models/Requests/ShikimoriRequest";
type FieldType = {
    page: number;
    query: string;
    season: string;
    status: [];
    kind: [];
    audience: [];
    genre: [];
    theme: [];
    order: string;
    censored: boolean;
};
const date = dayjs();

interface Props {
    genres: Genre[] | any;
    ids?: string;
    open: boolean;
    onClose: () => void;
    setRequest: Dispatch<SetStateAction<ShikimoriRequest>>;
    setPage: (newPage: number) => void;
}
function AnimeParamsMenu({
    genres,
    ids,
    open,
    setPage,
    onClose,
    setRequest,
}: Props) {
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [censored, setCensored] = useState<boolean>(true);

    const statusOptions = [
        { russian: "Онгоинг", id: "ongoing" },
        { russian: "Вышло", id: "released" },
        { russian: "Анонс", id: "anons" },
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
        setRequest({
            censored: true,
            page: 1,
            name: "",
            ids: ids,
            kind: "",
            status: "",
            order: "ranked",
            season: "",
            genre: "",
        });
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
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const handleFieldsChange = (changedValue: any, allValues: FieldType) => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
            const order = allValues.query ? "ranked" : allValues.order;
            setPage(1);
            setRequest({
                page: 1,
                name: allValues.query,
                season: allValues.season
                    ? dayjs(allValues.season).format("YYYY")
                    : "",
                status: allValues.status.toString(),
                kind: allValues.kind.toString(),
                genre: allValues.genre
                    .concat(allValues.audience)
                    .concat(allValues.theme)
                    .toString(),
                order: order,
                censored: allValues.censored,
            });
        }, 1000);
        return () => clearTimeout(timeoutIdRef.current!);
    };
    const onChange: CheckboxProps["onChange"] = (e) => {
        setCensored(e.target.checked);
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
                onValuesChange={handleFieldsChange}
            >
                <Flex
                    style={{ flexDirection: "column", marginBottom: 10 }}
                    gap={10}
                >
                    <Title level={5}>Безопасный поиск</Title>
                    <Flex>
                        <Descriptions items={items}></Descriptions>
                        <Form.Item name={"censored"} valuePropName="checked">
                            <Checkbox
                                onChange={onChange}
                                defaultChecked
                                checked={censored}
                            />
                        </Form.Item>
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
                                <Form.Item name={"order"}>
                                    <Segmented
                                        style={{
                                            backgroundColor: "transparent",
                                        }}
                                        block
                                        value="ranked"
                                        options={[
                                            {
                                                label: "По рейтингу",
                                                value: "ranked",
                                                icon: <StarOutlined />,
                                            },
                                            {
                                                label: "По популярности",
                                                value: "popularity",
                                                icon: <TeamOutlined />,
                                            },
                                            {
                                                label: "По алфавиту",
                                                value: "name",
                                                icon: <FontColorsOutlined />,
                                            },
                                            {
                                                label: "По дате выхода",
                                                value: "aired_on",
                                                icon: <CalendarOutlined />,
                                            },
                                        ]}
                                    />
                                </Form.Item>
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
                                    censored={censored}
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
