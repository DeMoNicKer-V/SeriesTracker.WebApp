"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";
import {
    Button,
    Col,
    ConfigProvider,
    Divider,
    Layout,
    Menu,
    Row,
    Typography,
    theme,
    Space,
    Avatar,
    Dropdown,
} from "antd";

import Icon, {
    MailOutlined,
    MenuFoldOutlined,
    CalendarOutlined,
    UserOutlined,
    SettingOutlined,
    MenuUnfoldOutlined,
    QuestionOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import { ShikimoriLogo } from "./img/ShikimoriLogo";

import SearchBar from "./components/searchbar";
import type { GetProp, GetProps, MenuProps } from "antd";
import { getRandomAnime } from "./services/shikimori";
import { usePathname, useRouter } from "next/navigation";
import { GetCoockie, LogOut } from "./api/coockie";
import { getUserById, UserResponse } from "./services/user";
type CustomIconComponentProps = GetProps<typeof Icon>;
const { Header, Content, Sider } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const [isUser, setIsUser] = useState<boolean>(false);
    const [user, setUser] = useState<UserResponse>();
    const [currentKey, setCurrentKey] = useState<string>("shikimori");
    const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

    const { Text, Title } = Typography;

    const HeartIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={ShikimoriLogo} {...props} />
    );

    const router = useRouter();

    const getRandomAnimeId = async () => {
        const id = await getRandomAnime();
        if (id) {
            router.push(`/shikimori/${id}`);
        }
    };
    type MenuItem = GetProp<MenuProps, "items">[number];
    const updateMenu = (user?: UserResponse) => {
        const items2: MenuItem[] = [
            {
                key: "shikimori",
                icon: <HeartIcon />,
                label: <Link href={"/shikimori"}>Главная</Link>,
            },
            {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: <Link href={"/calendar"}>Календарь выхода</Link>,
            },

            {
                key: "random",
                onClick: async () => getRandomAnimeId(),
                icon: <QuestionOutlined />,
                label: "Случайное аниме",
            },
        ];
        if (user?.permissions.includes(1)) {
            items2.push({
                key: "settings",
                icon: <SettingOutlined />,
                label: <Link href={"/settings"}>Настройки</Link>,
            });
        }

        setMenuItems(items2);
    };
    const items: MenuProps["items"] = [
        {
            label: user?.email,
            key: "0",
            style: { cursor: "default" },
            icon: <MailOutlined />,
            disabled: true,
        },
        {
            label: <Divider style={{ margin: 0, padding: 0 }} />,
            style: { cursor: "default" },
            key: "divider",
            disabled: true,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}`} target="_top">
                    Профиль
                </Link>
            ),
            key: "1",
            icon: <UserOutlined />,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}/edit`} target="_top">
                    Настройки
                </Link>
            ),
            key: "2",
            icon: <SettingOutlined />,
        },
        {
            label: (
                <Link href={"/login"} target="_top">
                    Выйти
                </Link>
            ),
            key: "3",
            onClick: async () => {
                await LogOut();
                router;
            },
            icon: <LogoutOutlined />,
        },
    ];

    const menuProps = {
        items,
    };
    const GetUser = async () => {
        var code = await GetCoockie();
        if (code) {
            localStorage.setItem("userId", code);
            setIsUser(true);
            const currentUser = await getUserById(code);
            updateMenu(currentUser);
            setUser(currentUser);
        } else {
            updateMenu(undefined);
        }
    };
    useEffect(() => {
        setCurrentKey(pathName?.split("/")[1]);
    }, [pathName]);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        GetUser();
        setMounted(true);
    }, []);
    if (typeof window !== "undefined") {
        window.onload = () => {
            document.getElementById("holderStyle")!.remove();
        };
    }
    useEffect(() => {
        document.getElementsByClassName(
            "ant-layout-sider-collapsed ant-layout-sider-below"
        ).length > 0
            ? (document.body.style.position = "fixed")
            : (document.body.style.position = "relative");
    }, [collapsed]);

    const darkTheme = {
        colorPrimary: "#DE1EB2",
        colorInfo: "#DE1EB2",
        colorLink: "#fff",
    };

    const darkThemeLayout = {
        Layout: {
            headerBg: "#101010",
            footerBg: "#0f0f0f",
            siderBg: "#101010",
            bodyBg: "#0f0f0f",
        },
        Menu: {
            activeBarBorderWidth: 0,
        },
        Radio: {
            colorBorder: "transparent",
        },
        Card: {
            colorBgContainer: "#121212",
            colorBorderSecondary: "transparent",

            boxShadowCard:
                "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        },
        Segmented: {
            itemSelectedBg: "#DE1EB2",
            colorBg: "transparent",
        },
        Drawer: {
            colorBgElevated: "#101010",
        },
        Input: {
            colorPrimaryHover: "#fff",
        },
        Collapse: {
            headerBg: "#141414",
            border: "none",
        },
        Form: {
            verticalLabelPadding: "8px 0",
        },
    };

    return (
        <html lang="en">
            <body>
                <style
                    id="holderStyle"
                    dangerouslySetInnerHTML={{
                        __html: `*, *::before, *::after {
                        transition: none!important;
                        }`,
                    }}
                />
                <ConfigProvider
                    theme={{
                        token: darkTheme,
                        algorithm: theme.darkAlgorithm,
                        components: darkThemeLayout,
                    }}
                >
                    <Layout
                        style={{
                            visibility: !mounted ? "hidden" : "visible",
                            minHeight: "100vh",
                            minWidth: "100vw",
                        }}
                    >
                        <title>Series Tracker</title>
                        <Header
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 99,

                                alignItems: "center",
                                padding: "0 20px",
                                boxShadow:
                                    "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                            }}
                        >
                            <Row align="middle" justify={"space-between"}>
                                <Col>
                                    <Button
                                        type="link"
                                        icon={
                                            collapsed ? (
                                                <MenuUnfoldOutlined />
                                            ) : (
                                                <MenuFoldOutlined />
                                            )
                                        }
                                        onClick={() => setCollapsed(!collapsed)}
                                    />
                                </Col>
                                {currentKey !== "shikimori" &&
                                    currentKey !== "random" && (
                                        <Col xs={0} sm={0} md={0} xl={10}>
                                            <SearchBar />
                                        </Col>
                                    )}
                                {isUser && (
                                    <Col>
                                        <Dropdown menu={menuProps}>
                                            <Button
                                                type="text"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                            >
                                                <Space
                                                    style={{
                                                        padding: "0 10px",
                                                    }}
                                                    size={[20, 20]}
                                                >
                                                    <Avatar
                                                        size={40}
                                                        shape="square"
                                                        src={user?.avatar}
                                                    ></Avatar>
                                                    <Typography.Title level={5}>
                                                        {user?.userName}
                                                    </Typography.Title>
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    </Col>
                                )}
                                {!isUser && (
                                    <Col>
                                        <Space size={[10, 10]}>
                                            <Button
                                                href={"/login"}
                                                target="_top"
                                                type="link"
                                                size="small"
                                            >
                                                Войти
                                            </Button>
                                            <Button
                                                target="_top"
                                                href={"/signup"}
                                                type="primary"
                                                ghost
                                                size="small"
                                            >
                                                Регистрация
                                            </Button>
                                        </Space>
                                    </Col>
                                )}
                            </Row>
                        </Header>
                        <Layout
                            hasSider
                            style={{
                                padding: 10,
                            }}
                        >
                            <Sider
                                width={230}
                                breakpoint="xl"
                                trigger={null}
                                collapsible
                                collapsed={collapsed}
                                style={{
                                    top: 80,
                                    overflow: "auto",
                                    height: "90vh",
                                    position: "sticky",
                                    transform: "translateX(0%)",
                                    padding: "4px",
                                    boxShadow:
                                        "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                                    borderRadius: 5,
                                }}
                            >
                                <Menu
                                    className="sider-menu"
                                    onSelect={({ key }) => {
                                        setCurrentKey(key);
                                        setCollapsed(true);
                                    }}
                                    selectedKeys={[currentKey]}
                                    style={{
                                        background: "transparent",
                                    }}
                                    mode="inline"
                                    items={menuItems}
                                />
                            </Sider>
                            <Layout>
                                <Content>{children}</Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </body>
        </html>
    );
}
