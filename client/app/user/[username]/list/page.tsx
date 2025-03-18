"use client";
import {
    Breadcrumb,
    Col,
    ConfigProvider,
    Flex,
    Menu,
    MenuProps,
    Row,
} from "antd";
import { useEffect, useState } from "react";
import {
    BookOutlined,
    CloseOutlined,
    NumberOutlined,
    SyncOutlined,
    FieldTimeOutlined,
    EyeOutlined,
    CheckOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import AnimeList from "@/app/components/Animes/AnimeList";
import { getUserCategoriesCount } from "@/app/api/user/getUser";

export default function UserPage({ params }: { params: { username: string } }) {
    const path = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState<number | any>(
        searchParams.get("page") != null ? searchParams.get("page") : 1
    );
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
    const search = useSearchParams();
    const [mylist, setMylist] = useState<string | any>(
        search.get("mylist") ? search.get("mylist")?.toString() : "0"
    );

    const getUserInfo = async (username: string) => {
        const myData = await getUserCategoriesCount(username);
        setSeries(
            new Map<string, number>(
                myData.map((item) => [item.key, item.value])
            )
        );
    };

    const {
        data = [],
        error,
        isLoading,
    } = useSWR(params.username, getUserInfo, {
        // Опции для useSWR
        revalidateOnFocus: false, // Отключить обновление при фокусе
        revalidateOnReconnect: false, // Отключить обновление при восстановлении соединения
        errorRetryInterval: 30000,
    });

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

    useEffect(() => {
        router.push(`${path}?mylist=${mylist}`);
    }, [mylist]);
    const router = useRouter();

    const onClick: MenuProps["onSelect"] = (e) => {
        setMylist(e.key);
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
            ></ConfigProvider>{" "}
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
                    },
                    {
                        title: "Список аниме",
                    },
                ]}
            />
            <Row gutter={[15, 15]} align={"middle"} justify={"center"}>
                <Col span={22}>
                    <Menu
                        style={{
                            justifyContent: "center",
                            backgroundColor: "transparent",
                        }}
                        onSelect={onClick}
                        selectedKeys={[mylist]}
                        items={sortMenuItems}
                        mode="horizontal"
                    />
                </Col>

                <Col span={24}>
                    <AnimeList />
                </Col>
            </Row>
        </div>
    );
}
