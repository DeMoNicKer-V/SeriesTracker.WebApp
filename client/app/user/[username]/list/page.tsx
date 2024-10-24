"use client";
import {
    Avatar,
    Breadcrumb,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    FloatButton,
    Menu,
    MenuProps,
    Row,
    Segmented,
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
    UserOutlined,
} from "@ant-design/icons";
import { Animes } from "@/app/components/Animes";
import {
    getAnimesByParams,
    getAnimesByUsername,
    getGenres,
    ShikimoriRequest,
} from "@/app/services/shikimori";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import { ShikimoriLogo } from "@/app/img/ShikimoriLogo";
import { CategoryCount, getUserCategoriesCount } from "@/app/services/user";
import AnimeParamsMenu from "@/app/components/AnimeParamsMenu";

export default function UserPage({ params }: { params: { username: string } }) {
    const path = usePathname();
    const searchParams = useSearchParams();
    const [genres, setGenres] = useState<Genre[] | any>([]);
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

    const [series, setSeries] = useState<Map<string, number>>(
        new Map([
            ["0", 0],
            ["1", 0],
            ["2", 0],
            ["3", 0],
            ["4", 0],
            ["5", 0],
            ["6", 0],
        ])
    );
    const { Text, Title } = Typography;

    const createQueryString = useMemo(
        () => (mylist: any, query: any) => {
            const params = new URLSearchParams(searchParams);
            params.set("mylist", String(mylist));
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
    const search = useSearchParams();
    const [mylist, setMylist] = useState<string | any>(
        search.get("mylist") ? search.get("mylist")?.toString() : "0"
    );

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
        const animes = await getAnimesByUsername(params.username, url);
        if (animes.length) {
            const myData = await getUserCategoriesCount(params.username);
            setSeries(
                new Map<string, number>(
                    myData.map((item) => [item.key, item.value])
                )
            );
        }
        return animes;
    };
    const pathname = usePathname();
    type MenuItem = Required<MenuProps>["items"][number];
    const sortMenuItems: MenuItem[] = [
        {
            label: `Всё (${
                series.get("0") !== undefined ? series.get("0") : 0
            })`,
            key: "0",
            icon: <NumberOutlined />,
        },
        {
            label: `Запланировано (${
                series.get("1") !== undefined ? series.get("1") : 0
            })`,
            key: "1",
            icon: <BookOutlined />,
            disabled: series.get("1") === undefined,
        },
        {
            label: `Смотрю (${
                series.get("2") !== undefined ? series.get("2") : 0
            })`,
            key: "2",
            icon: <EyeOutlined />,
            disabled: series.get("2") === undefined,
        },
        {
            label: `Просмотрено (${
                series.get("3") !== undefined ? series.get("3") : 0
            })`,
            key: "3",
            icon: <CheckOutlined />,
            disabled: series.get("3") === undefined,
        },
        {
            label: `Пересматриваю (${
                series.get("4") !== undefined ? series.get("4") : 0
            })`,
            key: "4",
            icon: <SyncOutlined />,
            disabled: series.get("4") === undefined,
        },
        {
            label: `Отложено (${
                series.get("5") !== undefined ? series.get("5") : 0
            })`,
            key: "5",
            icon: <FieldTimeOutlined />,
            disabled: series.get("5") === undefined,
        },
        {
            label: `Брошено (${
                series.get("6") !== undefined ? series.get("6") : 0
            })`,
            key: "6",
            icon: <CloseOutlined />,
            disabled: series.get("6") === undefined,
        },
    ];
    const [loading, setLoading] = useState(false);
    const {
        data = [],
        error,
        isLoading,
    } = useSWR(`${path}?${createQueryString(mylist, request)}`, getAnimesPost, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
    });
    useEffect(() => {
        router.push(`${path}?${createQueryString(mylist, request)}`);
    }, [request, mylist]);
    const router = useRouter();

    const onClick: MenuProps["onSelect"] = (e) => {
        setMylist(e.key);
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="container">
            <title>{`${params.username} / Список аниме`}</title>
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

            <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                <Col span={24}>
                    <Breadcrumb
                        separator=""
                        items={[
                            {
                                title: (
                                    <Link href={"./"}>
                                        <Flex justify="center" gap={5}>
                                            <UserOutlined /> {params.username}
                                        </Flex>
                                    </Link>
                                ),
                            },
                            {
                                type: "separator",
                                separator: ":",
                            },
                            {
                                title: (
                                    <Link
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            fontStyle: "italic",
                                            gap: 5,
                                            fontSize: 11,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        href={"./"}
                                    >
                                        <LongLeftArrow />
                                        Назад
                                    </Link>
                                ),
                            },
                            {
                                type: "separator",
                            },
                            {
                                title: "Список аниме",
                            },
                        ]}
                    />
                </Col>
                <Col span={22}>
                    <Menu
                        style={{ justifyContent: "center" }}
                        onSelect={onClick}
                        selectedKeys={[mylist]}
                        items={sortMenuItems}
                        mode="horizontal"
                    />
                </Col>
                <Divider />
                <Col span={22}>
                    <Animes loading={isLoading} animes={data} />
                </Col>
            </Row>
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
