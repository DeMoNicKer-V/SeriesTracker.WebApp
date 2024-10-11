"use client";
import {
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Animes } from "../components/Animes";
import {
    ShikimoriRequest,
    getAnimesByParams,
    getGenres,
} from "../services/shikimori";
import {
    Button,
    Col,
    Collapse,
    ConfigProvider,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    Divider,
    Drawer,
    Flex,
    FloatButton,
    Input,
    Menu,
    MenuProps,
    Row,
    Spin,
    Tag,
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
import AnimeParamsMenu from "../components/AnimeParamsMenu";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";

///////////////////////////////////////////////////////
const { Text, Title } = Typography;
type MenuItem = Required<MenuProps>["items"][number];
const date = dayjs();

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
export default function ShikimoriPage() {
    const searchParams = useSearchParams();
    const createQueryString = useMemo(
        () => (query: any) => {
            const params = new URLSearchParams(searchParams);
            for (const [name, value] of Object.entries(query)) {
                if (name && value) {
                    params.set(name, String(value));
                } else {
                    params.delete(name);
                }
            }

            return params.toString();
        },
        [searchParams]
    );
    const [isOpen, setIsOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[] | any>([]);
    const router = useRouter();
    const path = usePathname();

    const [page, setPage] = useState<number | any>(
        searchParams.get("page") != null ? searchParams.get("page") : 1
    );
    const [request, setRequest] = useState<ShikimoriRequest>({
        page: page,
        name: "",
        season: "",
        status: "",
        kind: "",
        genre: "",
        order: "ranked",
        censored: true,
    });

    const getGenresList = async () => {
        const list = await getGenres();
        setGenres(list);
    };
    useEffect(() => {
        return () => {
            getGenresList();
        };
    }, []);

    const getAnimesPost = async (url: string) => {
        const animes: SeriesAnime[] = await getAnimesByParams(url);
        return animes;
    };

    const nextPage = () => {
        setPage(Number(page) + 1);
        request.page = Number(page) + 1;
    };

    const prePage = () => {
        if (page > 1) {
            setPage(Number(page) - 1);
            request.page = Number(page) - 1;
        }
    };

    const firstPage = () => {
        setPage(1);
        request.page = 1;
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const {
        data = [],
        error,
        isLoading,
    } = useSWR(`${path}?${createQueryString(request)}`, getAnimesPost, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    useEffect(() => {
        router.push(`${path}?${createQueryString(request)}`);
    }, [request]);

    return (
        <div className="container">
            <title>Series Tracker - Shikimori</title>
            <Spin
                size="large"
                spinning={isLoading}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            />

            <Typography.Title style={{ margin: 0 }} level={3}>
                Аниме
            </Typography.Title>

            <Flex justify="start">
                {page > 2 && (
                    <Tooltip title={"В начало"}>
                        <Button
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                {data.length == 28 && (
                    <Tooltip title={"Дальше"}>
                        <Button
                            disabled={isLoading}
                            size="small"
                            type="link"
                            onClick={nextPage}
                            icon={<RightOutlined />}
                        />
                    </Tooltip>
                )}
            </Flex>
            <Divider />
            {Number(data.length) <= 0 && isLoading === false && (
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
            {!isLoading && <Animes animes={data} />}
            <AnimeParamsMenu
                genres={genres}
                open={isOpen}
                onClose={toggleOpen}
                setRequest={setRequest}
                setPage={setPage}
            />
            <FloatButton.Group style={{ right: 0, margin: 10, bottom: 32 }}>
                <FloatButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={toggleOpen}
                />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </div>
    );
}
