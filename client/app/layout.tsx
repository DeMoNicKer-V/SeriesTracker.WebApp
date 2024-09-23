"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";
import {
    Button,
    Card,
    Col,
    ConfigProvider,
    Divider,
    Drawer,
    Flex,
    FloatButton,
    Layout,
    List,
    Menu,
    Row,
    Switch,
    Typography,
    Image,
    theme,
    Segmented,
    Input,
    Collapse,
    Space,
    Avatar,
    Dropdown,
    message,
} from "antd";

import Icon, {
    SearchOutlined,
    MailOutlined,
    MenuFoldOutlined,
    CalendarOutlined,
    UserOutlined,
    SettingOutlined,
    MenuUnfoldOutlined,
    QuestionOutlined,
    HomeOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import Link from "next/link";

import { ShikimoriLogo } from "./img/ShikimoriLogo";

import SearchBar from "./components/searchbar";
import { getCookie, setCookie } from "cookies-next";
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
    const [currentTheme, setCurrentTheme] = useState(false);
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
        setCurrentKey("shikimori");
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
                onClick: () => getRandomAnimeId,
                icon: <QuestionOutlined />,
                label: <Text>Случайное аниме</Text>,
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
            label: "Мои аниме",
            key: "1",
            icon: <UserOutlined />,
        },
        {
            label: "Профиль",
            key: "2",
            icon: <UserOutlined />,
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
            icon: <UserOutlined />,
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

    useEffect(() => {
        GetUser();
        const colorThemeCookie = getCookie("theme");
        const vv = colorThemeCookie === "false" ? false : true;
        setCurrentTheme(vv);
    }, []);
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
        marginLG: "5px 0 24px",
        colorLink: "#fff",
    };

    const setColorThemeCookie = (value: boolean) => {
        setCurrentTheme(value);
        setCookie("theme", value);
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
    const lightTheme = {};

    const lightThemeLayout = {
        Layout: {
            headerBg: "#ffffff",
            siderBg: "#ffffff",
        },
        Menu: {
            activeBarBorderWidth: 0,
        },
        Radio: {
            colorBorder: "transparent",
        },
        Card: {
            colorBorderSecondary: "transparent",
        },
    };

    return (
        <html lang="en">
            <body style={{ background: currentTheme ? "#0f0f0f" : "#ffffff" }}>
                <ConfigProvider
                    theme={{
                        token: currentTheme ? darkTheme : lightTheme,
                        algorithm: currentTheme
                            ? theme.darkAlgorithm
                            : theme.defaultAlgorithm,

                        components: currentTheme
                            ? darkThemeLayout
                            : lightThemeLayout,
                    }}
                >
                    <Layout>
                        <title>Series Tracker</title>
                        <Header
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 99,
                                width: "100%",
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
                                {currentKey !== "shikimori" && (
                                    <Col span={10}>
                                        <SearchBar
                                            listBG={
                                                currentTheme
                                                    ? "#1e1e1e"
                                                    : "#ffffff"
                                            }
                                        />
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
                                                <Space size={[20, 20]}>
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
                            style={{
                                padding: 10,
                            }}
                        >
                            <Sider
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
