import {
    CalendarOutlined,
    FontColorsOutlined,
    SearchOutlined,
    StarOutlined,
    TeamOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import {
    Button,
    Checkbox,
    CheckboxProps,
    Collapse,
    DatePicker,
    Drawer,
    Flex,
    Form,
    Input,
    Segmented,
    Tooltip,
    Typography,
} from "antd";
import dayjs from "dayjs";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { getGenres } from "../api/animes/genre/getGenre";
import { kindOptions, statusOptions } from "../constants/constants";
import {
    defaultShikimoriRequest,
    ShikimoriRequest,
} from "../models/requests/ShikimoriRequest";
import FilterItem from "./FilterItem";
import SafeModeDescription from "./SafeModeDescription";
// Определение типа для полей формы
type FieldType = {
    query: string; // Поисковый запрос
    season: dayjs.Dayjs | null; // Сезон
    status: string[]; // Массив статусов
    kind: string[]; // Массив типов
    genre: Genre[]; // Массив ID жанров
    audience: Genre[]; // Массив ID целевой аудитории
    theme: Genre[]; // Массив ID тем
    order: string; // Порядок сортировки
    censored: boolean; // Флаг "безопасного режима"
};
const date = dayjs();
const { Title } = Typography;

// Определение интерфейса Props для компонента AnimeParamsMenu
interface Props {
    open: boolean; // Флаг, определяющий, открыт ли Drawer (обязательно)
    onClose: () => void; // Callback-функция, вызываемая при закрытии Drawer (обязательно)
    setRequest: Dispatch<SetStateAction<ShikimoriRequest>>; // Функция для обновления состояния запроса к Shikimori API (обязательно)
    setPage: (newPage: number) => void; // Функция для установки номера страницы (обязательно)
}
/**
 * @component AnimeFilterForm
 * @description Компонент Drawer с формой для фильтрации аниме.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const AnimeFilterForm: React.FC<Props> = ({
    open,
    setPage,
    onClose,
    setRequest,
}: Props): JSX.Element => {
    const [form] = Form.useForm<FieldType>(); // Создаем экземпляр Form
    const [genres, setGenres] = useState<GroupGenre | null>(null); // Состояние для хранения списка жанров (изначально null)
    const [censored, setCensored] = useState<boolean>(true); // Состояние для "безопасного режима" (по умолчанию включен)
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null); // Ref для хранения ID таймера

    const resetAllFields = () => {
        setRequest(() => defaultShikimoriRequest); // Используем функциональный подход
        form.resetFields();
        setPage(1);
    };

    //Обработчик изменения полей формы.
    // Устанавливает таймер для обновления состояния запроса с задержкой в 1 секунду.
    const handleFieldsChange = (_: any, allValues: FieldType): (() => void) => {
        if (timeoutIdRef.current) {
            // Если таймер уже запущен, очищаем его
            clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
            const order = allValues.query ? "ranked" : allValues.order;
            setPage(1);
            setRequest((prevRequest) => ({
                // Обновляем состояние запроса
                ...prevRequest,
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
                    .toString(), // Объединяем и преобразуем массивы жанров, аудитории и тем в строку
                order: order,
                censored: allValues.censored,
            }));
        }, 1000);

        return () => clearTimeout(timeoutIdRef.current!); // Возвращаем функцию для очистки таймера
    };

    //Обработчик изменения состояния чекбокса "безопасного режима".

    const onChange: CheckboxProps["onChange"] = (e) => {
        setCensored(e.target.checked); // Обновляем состояние "безопасного режима"
    };

    // Асинхронная функция для загрузки жанров
    const fetchGenres = useCallback(async () => {
        try {
            const response = await getGenres();
            setGenres(response);
        } catch (error) {
            console.error("Ошибка при загрузке жанров:", error);
        }
    }, []);

    useEffect(() => {
        if (!genres) {
            fetchGenres();
        }
    }, [fetchGenres, genres]);

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
                        <SafeModeDescription censored={censored} />
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
                                    dataSource={genres?.demographic}
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
                                    dataSource={genres?.genre}
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
                                    dataSource={genres?.theme}
                                    index="theme"
                                />
                            ),
                        },
                    ]}
                ></Collapse>
            </Form>
        </Drawer>
    );
};

export default AnimeFilterForm;
