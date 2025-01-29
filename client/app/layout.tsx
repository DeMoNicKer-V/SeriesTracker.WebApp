"use client";
import React, { useEffect, useMemo, useState } from "react";
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
    Flex,
    FloatButton,
} from "antd";

import Icon, {
    MailOutlined,
    MenuFoldOutlined,
    CalendarOutlined,
    UserOutlined,
    SettingOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    InfoCircleOutlined,
    BookOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import { ShikimoriLogo } from "./img/ShikimoriLogo";

import SearchBar from "./components/searchbar";
import type { GetProp, GetProps, MenuProps } from "antd";
import { getRandomAnime } from "./services/shikimori";
import { usePathname, useRouter } from "next/navigation";
import { GetDecodedUserToken, LogOut } from "./api/coockie";
import { getUserById } from "./services/user";
import { LogoIcon } from "./img/LogoIcon";
import { Footer } from "antd/es/layout/layout";
import { RandomIcon } from "./img/RandomIcon";
import siteLogo from "./img/logo.ico";
import { StarsBackground } from "./components/StarsBackground";
import Loading from "./components/Loading";
import MainFooterContent from "./components/Layout/MainFooterContent";
type CustomIconComponentProps = GetProps<typeof Icon>;
const { Header, Content, Sider } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const [controlEntered, setControlEntered] = useState(false);
    const [user, setUser] = useState<User>();
    const [currentKey, setCurrentKey] = useState<string>("shikimori");
    const [loading, setLoading] = useState<boolean>(true);
    const [mounted, setMounted] = useState(false);

    const ShikimoriMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={ShikimoriLogo} {...props} />
    );
    const RandomMenuIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={RandomIcon} {...props} />
    );

    const router = useRouter();

    const getRandomAnimeId = async () => {
        const id = await getRandomAnime();
        router.push(`/shikimori/${id}`);
    };
    type MenuItem = Required<MenuProps>["items"][number];
    const siderMenuItems: MenuItem[] = useMemo(() => {
        const baseItems: (MenuItem | false)[] = [
            {
                key: "shikimori",
                icon: <ShikimoriMenuIcon />,
                label: <Link href={"/shikimori"}>Главная</Link>,
            },
            {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: <Link href={"/calendar"}>Календарь выхода</Link>,
            },
            {
                onClick: async () => getRandomAnimeId(),
                key: "random",
                icon: <RandomMenuIcon />,
                label: "Случайное аниме",
            },
            user && user.roleId < 3
                ? {
                      key: "settings",
                      icon: <SettingOutlined />,
                      label: <Link href={"/settings"}>Настройки</Link>,
                  }
                : false,
        ];
        return baseItems.filter(Boolean) as MenuItem[];
    }, [user]);

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
                <Link href={`/user/${user?.userName}/list`} target="_top">
                    Мои аниме
                </Link>
            ),
            key: "2",
            icon: <BookOutlined />,
        },
        {
            label: (
                <Link href={`/user/${user?.userName}/edit`} target="_top">
                    Настройки
                </Link>
            ),
            key: "3",
            icon: <SettingOutlined />,
        },
        {
            label: (
                <Link href={"/login"} target="_top">
                    Выйти
                </Link>
            ),
            key: "4",
            onClick: async () => {
                await LogOut();
                router;
            },
            icon: <LogoutOutlined />,
        },
    ];

    const mouseControlEnter = () => {
        setControlEntered(true);
    };

    const mouseControlLeave = () => {
        setControlEntered(false);
    };

    const GetUser = async () => {
        var code = await GetDecodedUserToken();
        if (code.userId) {
            const currentUser = await getUserById(code.userId);
            setUser(currentUser);
        }
    };
    useEffect(() => {
        setCurrentKey(pathName?.split("/")[1]);
        setLoading(false);
    }, [pathName]);

    useEffect(() => {
        GetUser();
        setMounted(true);
    }, []);

    useEffect(() => {
        document.getElementsByClassName(
            "ant-layout-sider-collapsed ant-layout-sider-below"
        ).length > 0
            ? (document.body.style.position = "fixed")
            : (document.body.style.position = "relative");
    }, [collapsed]);

    const darkTheme = {
        colorPrimary: "#44a5a6",
        colorInfo: "#44a5a6",
        colorLink: "#fff",
    };

    const darkThemeLayout = {
        Layout: {
            headerBg: "#151515",
            footerBg: "transparent",
            siderBg: "#151515",
            bodyBg: ["/signup", "/login"].includes(pathName)
                ? "radial-gradient(ellipse at bottom, #08494961 0%, #151515 100%)"
                : "#151515",
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
            bodyPadding: 0,
            boxShadowCard:
                "0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 3px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
        },
        Segmented: {
            itemSelectedBg: "#44a5a6",
            colorBg: "transparent",
        },
        Drawer: {
            colorBgElevated: "#151515",
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
        Typography: {
            colorLink: "#44a5a6",
            colorLinkHover: "#44a5a661",
        },
    };

    return (
        <html lang="en">
            <head>
                <link rel="icon" href={siteLogo.src} />
            </head>
            <body>
                <StarsBackground />

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
                        }}
                    >
                        <title>Series Tracker</title>
                        <Header
                            onMouseEnter={mouseControlEnter}
                            onMouseLeave={mouseControlLeave}
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 99,
                                display: ["/signup", "/login"].includes(
                                    pathName
                                )
                                    ? "none"
                                    : "block",

                                alignItems: "center",
                                padding: "0 20px",
                                boxShadow:
                                    "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                                opacity: controlEntered ? 1 : 0.75,
                                transition: "all 0.2s,background 0s",
                            }}
                        >
                            <Row align="middle" justify={"space-between"}>
                                <Col>
                                    <Flex>
                                        <Button
                                            type="text"
                                            icon={
                                                collapsed ? (
                                                    <MenuUnfoldOutlined />
                                                ) : (
                                                    <MenuFoldOutlined />
                                                )
                                            }
                                            onClick={() =>
                                                setCollapsed(!collapsed)
                                            }
                                        />
                                        <Button
                                            style={{ cursor: "pointer" }}
                                            disabled={pathName === "/shikimori"}
                                            href="/shikimori"
                                            type="link"
                                        >
                                            <LogoIcon
                                                width={40}
                                                height={40}
                                                firstColor="white"
                                                secondColor="#44a5a6"
                                            />
                                        </Button>
                                    </Flex>
                                </Col>

                                <Col xs={0} sm={0} md={0} xl={10}>
                                    <SearchBar />
                                </Col>

                                {user ? (
                                    <Col>
                                        <Dropdown menu={{ items }}>
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
                                                        style={{
                                                            borderColor:
                                                                "#313131",
                                                        }}
                                                        size={40}
                                                        shape="circle"
                                                        src={user?.avatar}
                                                    ></Avatar>
                                                    <Typography.Title level={5}>
                                                        {user?.userName}
                                                    </Typography.Title>
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    </Col>
                                ) : (
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
                        <Layout hasSider>
                            <Sider
                                onMouseEnter={mouseControlEnter}
                                onMouseLeave={mouseControlLeave}
                                width={235}
                                breakpoint="xl"
                                trigger={null}
                                collapsible
                                collapsed={collapsed}
                                style={{
                                    top: 80,
                                    overflow: "hidden",
                                    height: "90vh",
                                    position: "sticky",
                                    transform: "translateX(0%)",
                                    padding: 5,
                                    margin: 5,
                                    boxShadow:
                                        "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                                    borderRadius: 5,
                                    display: ["/signup", "/login"].includes(
                                        pathName
                                    )
                                        ? "none"
                                        : "block",
                                    opacity: controlEntered ? 1 : 0.75,
                                }}
                            >
                                <Menu
                                    className="sider-menu"
                                    onSelect={({ key }) => {
                                        setLoading(true);
                                        setCurrentKey(key);
                                    }}
                                    onClick={() => setCollapsed(true)}
                                    selectedKeys={[currentKey]}
                                    style={{
                                        background: "transparent",
                                    }}
                                    mode="inline"
                                    items={siderMenuItems}
                                />
                                <FloatButton
                                    href="/about"
                                    tooltip={"Правила сайта"}
                                    style={
                                        collapsed
                                            ? { right: "25%", bottom: 20 }
                                            : { right: "3%", bottom: 20 }
                                    }
                                    icon={<InfoCircleOutlined />}
                                />
                            </Sider>
                            <Layout className="main-content-layout">
                                <Content>
                                    {loading && <Loading loading={loading} />}
                                    {!loading && children}
                                </Content>

                                <Footer>
                                    <Divider style={{ margin: 0 }} />
                                    <MainFooterContent
                                        alignItems={
                                            ["/login", "/signup"].includes(
                                                pathName
                                            )
                                                ? "center"
                                                : "start"
                                        }
                                    />
                                </Footer>
                            </Layout>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </body>
        </html>
    );
}
