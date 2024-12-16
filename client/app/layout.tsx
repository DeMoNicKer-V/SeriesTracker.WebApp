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
    QuestionOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    InfoCircleTwoTone,
    InfoCircleFilled,
    InfoCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import { ShikimoriLogo } from "./img/ShikimoriLogo";

import SearchBar from "./components/searchbar";
import type { GetProp, GetProps, MenuProps } from "antd";
import { getRandomAnime } from "./services/shikimori";
import { usePathname, useRouter } from "next/navigation";
import { GetCoockie, LogOut } from "./api/coockie";
import { getUserById, UserResponse } from "./services/user";
import { LogoIcon } from "./img/LogoIcon";
import { Footer } from "antd/es/layout/layout";
import Meta from "antd/es/card/Meta";
import { VKLogo } from "./img/socials/vk";
import { GithubLogo } from "./img/socials/github";
import { TelegramLogo } from "./img/socials/telegram";
import { RandomIcon } from "./img/RandomIcon";
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
                icon: (
                    <span role="img">
                        <RandomIcon />
                    </span>
                ),
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

            boxShadowCard:
                "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
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
            <body>
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
                                display: ["/signup", "/login"].includes(
                                    pathName
                                )
                                    ? "none"
                                    : "block",

                                alignItems: "center",
                                padding: "0 20px",
                                boxShadow:
                                    "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                            }}
                        >
                            <Row align="middle" justify={"space-between"}>
                                <Col>
                                    <Flex gap={20}>
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
                                            icon={
                                                <LogoIcon
                                                    width={50}
                                                    height={50}
                                                    firstColor="white"
                                                    secondColor="#44a5a6"
                                                />
                                            }
                                        />
                                    </Flex>
                                </Col>

                                <Col xs={0} sm={0} md={0} xl={10}>
                                    <SearchBar />
                                </Col>

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
                        <Layout hasSider>
                            <Sider
                                width={230}
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
                                }}
                            >
                                <Menu
                                    className="sider-menu"
                                    onSelect={({ key }) => {
                                        setCurrentKey(key);
                                    }}
                                    onClick={() => setCollapsed(true)}
                                    selectedKeys={[currentKey]}
                                    style={{
                                        background: "transparent",
                                    }}
                                    mode="inline"
                                    items={menuItems}
                                />
                                <FloatButton
                                    href="/about"
                                    tooltip={"Правила сайта"}
                                    badge={{ dot: true }}
                                    style={
                                        collapsed
                                            ? { right: "25%", bottom: 20 }
                                            : { right: "3%", bottom: 20 }
                                    }
                                    icon={<InfoCircleOutlined />}
                                />
                            </Sider>
                            <Layout className="main-content-layout">
                                <Content>{children}</Content>

                                <Footer>
                                    <Divider style={{ margin: 0 }} />
                                    <Flex
                                        className="flex-column footer"
                                        align={
                                            ["/login", "/signup"].includes(
                                                pathName
                                            )
                                                ? "center"
                                                : "start"
                                        }
                                    >
                                        <Title level={4}>Соц. сети</Title>
                                        <Space size={[10, 10]}>
                                            <Button
                                                target="_blank"
                                                href="https://vk.com/v_shakov"
                                                type="link"
                                                icon={<VKLogo size={24} />}
                                            ></Button>
                                            <Button
                                                target="_blank"
                                                href="https://github.com/DeMoNicKer-V"
                                                type="link"
                                                icon={<GithubLogo size={24} />}
                                            ></Button>
                                            <Button
                                                target="_blank"
                                                href="https://t.me/Vitek_Dev"
                                                type="link"
                                                icon={
                                                    <TelegramLogo size={24} />
                                                }
                                            ></Button>
                                        </Space>
                                        <Text
                                            style={{ fontSize: 11 }}
                                            type="secondary"
                                        >
                                            Данный сайт не хранит на своем
                                            сервере никаких данных. Весь контент
                                            на сайте предоставляется сайтом{" "}
                                            <Typography.Link
                                                href="https://shikimori.one"
                                                target="_blank"
                                                style={{ fontSize: 11 }}
                                                type="secondary"
                                            >
                                                Shikimori.One.
                                            </Typography.Link>
                                        </Text>
                                        <Text strong style={{ fontSize: 15 }}>
                                            Copyright ©
                                            <Typography.Link
                                                style={{ fontSize: 15 }}
                                                className="info"
                                                strong
                                                href={"/shikimori"}
                                            >
                                                Series Tracker
                                            </Typography.Link>
                                            {` ${new Date().getFullYear()}. `}
                                            All Rights Reserved.
                                        </Text>
                                    </Flex>
                                </Footer>
                            </Layout>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </body>
        </html>
    );
}
