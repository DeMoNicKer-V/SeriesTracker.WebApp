"use client"; //  Компонент клиентской стороны (обязательно для Next.js)

// Импортируем необходимые модули и компоненты
import { ConfigProvider, Divider, Layout, theme } from "antd";
import { Footer } from "antd/es/layout/layout";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderMenu from "./components/Layout/HeaderMenu";
import MainFooterContent from "./components/Layout/MainFooterContent";
import SiderMenu from "./components/Layout/SiderMenu";
import StarsBackground from "./components/StarsBackground/StarsBackground";
import { UserProvider } from "./components/UserContext";
import "./globals.css";
import siteLogo from "./img/logo.ico";
const { Content } = Layout;

//  Основной компонент Layout (RootLayout)
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    //  Хук для получения текущего пути
    const pathName = usePathname();

    //  Состояние для управления состоянием бокового меню (свернуто/развернуто)
    const [collapsed, setCollapsed] = useState(true);

    //  Состояние для отслеживания, был ли компонент смонтирован (для предотвращения мерцания)
    const [mounted, setMounted] = useState(false);

    //  Эффект для установки mounted в true после монтирования компонента
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <html lang="en">
            <head>
                {/*  Мета-тег для иконки сайта */}
                <link rel="icon" href={siteLogo.src} />
            </head>
            <body>
                {/*  Фоновый компонент с анимацией звезд */}
                <StarsBackground />

                {/*  Ant Design Provider для настройки глобальных стилей компонентов */}
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#44a5a6",
                            colorInfo: "#44a5a6",
                            colorLink: "#fff",
                        },
                        algorithm: theme.darkAlgorithm,
                        components: {
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
                            },
                            Segmented: {
                                itemSelectedBg: "#44a5a6",
                                colorBgContainer: "transparent",
                            },
                            Drawer: {
                                colorBgElevated: "#151515",
                            },
                            Input: {
                                colorPrimaryHover: "#fff",
                            },
                            Collapse: {
                                headerBg: "#141414",
                            },
                            Form: {
                                verticalLabelPadding: "8px 0",
                            },
                            Typography: {
                                colorLink: "#44a5a6",
                                colorLinkHover: "#44a5a661",
                            },
                        },
                    }}
                >
                    {/*  Provider для управления данными пользователя */}
                    <UserProvider>
                        {/*  Основной компонент Layout из Ant Design */}
                        <Layout
                            style={{
                                //  Скрываем контент до монтирования, чтобы избежать мерцания
                                visibility: !mounted ? "hidden" : "visible",
                                minHeight: "100vh", //  Занимаем всю высоту экрана
                            }}
                        >
                            {/*  Заголовок страницы (не отображается визуально) */}
                            <title>Series Tracker</title>

                            {/*  Компонент шапки (меню) */}
                            <HeaderMenu
                                pathName={pathName}
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                            />

                            {/*  Основной контейнер с боковым меню и контентом */}
                            <Layout
                                className={
                                    collapsed //  Применяем разные классы в зависимости от состояния бокового меню
                                        ? "main-sider-layout"
                                        : "main-sider-layout fullscreen"
                                }
                                hasSider //  Указываем, что есть боковое меню
                            >
                                {/*  Компонент бокового меню */}
                                <SiderMenu
                                    setCollapsed={setCollapsed} //  Передаем функцию для управления состоянием
                                    collapsed={collapsed} //  Передаем состояние свернутости/развернутости
                                    pathName={pathName} //  Передаем текущий путь
                                />

                                {/*  Контейнер для основного контента */}
                                <Layout className="main-content-layout">
                                    {/*  Отображаем дочерние компоненты */}
                                    <Content>{children}</Content>

                                    {/*  Компонент футера */}
                                    <Footer>
                                        <Divider style={{ margin: 0 }} />{" "}
                                        <MainFooterContent
                                            alignItems={
                                                ["/login", "/signup"].includes(
                                                    pathName
                                                ) //  Выравнивание футера в зависимости от текущего пути
                                                    ? "center"
                                                    : "start"
                                            }
                                        />
                                    </Footer>
                                </Layout>
                            </Layout>
                        </Layout>
                    </UserProvider>
                </ConfigProvider>
            </body>
        </html>
    );
}
