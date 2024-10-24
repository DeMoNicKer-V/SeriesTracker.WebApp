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
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container">
            <title>Series Tracker - Shikimori</title>
            <Typography.Title style={{ margin: 0 }} level={3}>
                Аниме
            </Typography.Title>
            <Animes isDrawerOpen={isOpen} onDrawerClose={toggleOpen} />

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
