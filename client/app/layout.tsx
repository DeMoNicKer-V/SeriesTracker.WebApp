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
} from "antd";

import Icon, {
    SearchOutlined,
    MenuFoldOutlined,
    CalendarOutlined,
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
import type { GetProps } from "antd";
import { getRandomAnime } from "./services/shikimori";
import { usePathname, useRouter } from "next/navigation";
type CustomIconComponentProps = GetProps<typeof Icon>;
const { Header, Content, Sider } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(true);
    const [currentTheme, setCurrentTheme] = useState(false);
    const [currentKey, setCurrentKey] = useState(usePathname()?.split("/")[1]);

    useEffect(() => {
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
                "0 -2px 2px 0 rgba(222, 30, 178, 0.1), 0 1px 6px -1px rgba(222, 30, 178, 0.2), 0 2px 4px 0 rgba(222, 30, 178, 0.1)",
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

    const HeartIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={ShikimoriLogo} {...props} />
    );
    const { Text, Title } = Typography;
    const router = useRouter();

    const getRandomAnimeId = async () => {
        const id = await getRandomAnime();
        setCurrentKey("shikimori");
        if (id) {
            router.push(`/shikimori/${id}`);
        }
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
                    <Layout
                        style={{ minHeight: "100vh", minWidth: "100vw" }}
                        className={currentTheme ? "darkTheme" : "lightTheme"}
                    >
                        <title>Series Tracker</title>
                        <Header
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 99,
                                width: "100%",
                                alignItems: "center",
                                boxShadow:
                                    "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                            }}
                        >
                            <Row align="middle">
                                <Col span={1}>
                                    <Button
                                        type="text"
                                        icon={
                                            collapsed ? (
                                                <MenuUnfoldOutlined />
                                            ) : (
                                                <MenuFoldOutlined />
                                            )
                                        }
                                        onClick={() => setCollapsed(!collapsed)}
                                        style={{
                                            marginLeft: "-50px",
                                            height: 64,
                                            width: 64,
                                            color: "#fff",
                                        }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <div className="spacer" />{" "}
                                </Col>
                                <Col span={8}>
                                    <SearchBar
                                        listBG={
                                            currentTheme ? "#1e1e1e" : "#ffffff"
                                        }
                                    />
                                </Col>
                                <Col span={6}>
                                    <div className="spacer" />{" "}
                                </Col>
                                <Col span={1}>
                                    <Switch
                                        checked={currentTheme}
                                        checkedChildren={<MoonOutlined />}
                                        unCheckedChildren={<SunOutlined />}
                                        onChange={(checked: any) => {
                                            setColorThemeCookie(checked);
                                        }}
                                    />
                                </Col>
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
                                    items={[
                                        {
                                            key: "series",
                                            icon: <HomeOutlined />,
                                            label: (
                                                <Link href={"/series"}>
                                                    Ваши сериалы
                                                </Link>
                                            ),
                                        },
                                        {
                                            key: "search",
                                            icon: <SearchOutlined />,
                                            label: (
                                                <Link href={"/search"}>
                                                    Поиск
                                                </Link>
                                            ),
                                        },
                                        {
                                            key: "shikimori",
                                            icon: <HeartIcon />,
                                            label: (
                                                <Link href={"/shikimori"}>
                                                    Аниме
                                                </Link>
                                            ),
                                        },
                                        {
                                            key: "calendar",
                                            icon: <CalendarOutlined />,
                                            label: (
                                                <Link href={"/calendar"}>
                                                    Календарь выхода
                                                </Link>
                                            ),
                                        },
                                        {
                                            key: "random",
                                            onClick: getRandomAnimeId,
                                            icon: <QuestionOutlined />,
                                            label: <Text>Случайное аниме</Text>,
                                        },
                                        {
                                            key: "settings",
                                            icon: <SettingOutlined />,
                                            label: (
                                                <Link href={"/settings"}>
                                                    Настройки
                                                </Link>
                                            ),
                                        },
                                    ]}
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
