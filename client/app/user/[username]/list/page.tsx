"use client";
import {
    Avatar,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    Menu,
    MenuProps,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import Meta from "antd/es/card/Meta";
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
    BookOutlined,
    HistoryOutlined,
    CloseOutlined,
    NumberOutlined,
    SyncOutlined,
    FieldTimeOutlined,
    MoreOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import { Animes } from "@/app/components/Animes";
import {
    getAnimesByParams,
    getAnimesByUserId,
    getAnimesByUsername,
    ShikimoriRequest,
} from "@/app/services/shikimori";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function UserPage({ params }: { params: { username: string } }) {
    const [animes, setAnimes] = useState<SeriesAnime[] | any>([]);
    const { Text, Title } = Typography;
    const path = usePathname();
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
    const [mylist, setMylist] = useState<string>("0");
    const search = useSearchParams();
    const getAnimesPost = async (mylist: number) => {
        const animes = await getAnimesByUsername(params.username, mylist);
        setAnimes(animes);
        setLoading(false);
    };
    const pathname = usePathname();
    type MenuItem = Required<MenuProps>["items"][number];
    const sortMenuItems: MenuItem[] = [
        {
            style: { marginLeft: "auto" },
            label: "Всё",
            key: "0",
            icon: <NumberOutlined />,
        },
        {
            label: "Запланировано",
            key: "1",
            icon: <BookOutlined />,
        },
        {
            label: "Смотрю",
            key: "2",
            icon: <EyeOutlined />,
        },
        {
            label: "Просмотрено",
            key: "3",
            icon: <CheckOutlined />,
        },
        {
            label: "Пересматриваю",
            key: "4",
            icon: <SyncOutlined />,
        },
        {
            label: "Отложено",
            key: "5",
            icon: <FieldTimeOutlined />,
        },
        {
            label: "Брошено",
            key: "6",
            icon: <CloseOutlined />,
        },
    ];
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setLoading(true);
        getAnimesPost(Number(search.get("mylist")));
    }, [search.get("mylist")]);
    const onClick: MenuProps["onSelect"] = (e) => {
        setMylist(e.key);
        router.push(`?mylist=${e.key}`);
    };

    return (
        <div className="container">
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemBg: "transparent",
                            darkItemBg: "transparent",
                        },
                    },
                }}
            ></ConfigProvider>
            <Link href={"./"}>Назад</Link>
            {!loading && (
                <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                    <Col span={20}>
                        <Menu
                            onSelect={onClick}
                            selectedKeys={[mylist]}
                            items={sortMenuItems}
                            mode="horizontal"
                        />
                    </Col>
                    <Divider />
                    <Col span={20}>
                        <Animes animes={animes} />
                    </Col>
                </Row>
            )}
        </div>
    );
}
