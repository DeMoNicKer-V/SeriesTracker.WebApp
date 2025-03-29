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
import { useCallback, useEffect, useState } from "react";
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
import { getUserCategoriesCount } from "@/app/api/user/getUser";
import LoadingContentHandler from "@/app/components/LoadingContentHandler";
import PageErrorView from "@/app/components/PageErrorVIew";
import UsersAnimeList from "@/app/components/Animes/UsersAnimeList";

export default function UserPage({ params }: { params: { username: string } }) {
    const router = useRouter();
    const path = usePathname();
    const search = useSearchParams();
    const [empty, setEmpty] = useState<boolean | null>(null);
    const [mylist, setMylist] = useState<string | any>(
        search.get("mylist") ? search.get("mylist")?.toString() : "0"
    );
    const [colors, setColors] = useState<Map<string, string> | any>(
        new Map([["0", ""]])
    );

    const getUsersGroups = async (username: string) => {
        const response = await getUserCategoriesCount(username);
        if (response && response[0].value > 0) {
            setEmpty(false);
        } else {
            setEmpty(true);
            return new Map();
        }
        const cc = new Map<string, string>(
            response.map((item) => [item.key, item.color])
        );
        setColors(cc);
        const seriesGroup = new Map<string, number>(
            response.map((item) => [item.key, item.value])
        );
        return seriesGroup;
    };

    const {
        data: groups = new Map([
            ["0", 0],
            ["1", 0],
            ["2", 0],
            ["3", 0],
            ["4", 0],
            ["5", 0],
            ["6", 0],
        ]),
    } = useSWR<Map<string, number>>(params.username, getUsersGroups, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryInterval: 30000,
    });

    type MenuItem = Required<MenuProps>["items"][number];
    const sortMenuItems: MenuItem[] = [
        {
            label: `Всё (${
                groups.get("0") !== undefined ? groups.get("0") : 0
            })`,
            key: "0",
            icon: <NumberOutlined />,
        },
        {
            label: `Запланировано (${
                groups.get("1") !== undefined ? groups.get("1") : 0
            })`,
            key: "1",
            icon: <BookOutlined />,
            disabled: groups.get("1") === undefined,
        },
        {
            label: `Смотрю (${
                groups.get("2") !== undefined ? groups.get("2") : 0
            })`,
            key: "2",
            icon: <EyeOutlined />,
            disabled: groups.get("2") === undefined,
        },
        {
            label: `Просмотрено (${
                groups.get("3") !== undefined ? groups.get("3") : 0
            })`,
            key: "3",
            icon: <CheckOutlined />,
            disabled: groups.get("3") === undefined,
        },
        {
            label: `Пересматриваю (${
                groups.get("4") !== undefined ? groups.get("4") : 0
            })`,
            key: "4",
            icon: <SyncOutlined />,
            disabled: groups.get("4") === undefined,
        },
        {
            label: `Отложено (${
                groups.get("5") !== undefined ? groups.get("5") : 0
            })`,
            key: "5",
            icon: <FieldTimeOutlined />,
            disabled: groups.get("5") === undefined,
        },
        {
            label: `Брошено (${
                groups.get("6") !== undefined ? groups.get("6") : 0
            })`,
            key: "6",
            icon: <CloseOutlined />,
            disabled: groups.get("6") === undefined,
        },
    ];

    const filterList = useCallback(() => {
        router.push(`${path}?mylist=${mylist}`);
    }, [mylist]);

    useEffect(() => {
        filterList();
    }, [filterList]);

    const onClick: MenuProps["onSelect"] = (e) => {
        setMylist(e.key);
    };

    return (
        <LoadingContentHandler
            condition={empty}
            defaultNode={
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
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Menu: {
                                            itemSelectedColor: `${colors?.get(
                                                mylist
                                            )} !important`,
                                        },
                                    },
                                }}
                            >
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
                            </ConfigProvider>
                        </Col>

                        <Col span={24}>
                            <UsersAnimeList
                                color={colors.get(mylist)}
                                myList={mylist}
                                userName={params.username}
                            />
                        </Col>
                    </Row>
                </div>
            }
            onErrorNode={
                <PageErrorView
                    text="Пользователь еще ничего не добавил"
                    href="./"
                    btnText="Вернуться назад"
                />
            }
        />
    );
}
