"use client";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <html lang="en">
            <head>
                <link rel="icon" href={siteLogo.src} />
            </head>
            <body>
                <StarsBackground />
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
                    <UserProvider>
                        <Layout
                            style={{
                                visibility: !mounted ? "hidden" : "visible",
                                minHeight: "100vh",
                            }}
                        >
                            <title>Series Tracker</title>
                            <HeaderMenu
                                pathName={pathName}
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                            />
                            <Layout
                                className={
                                    collapsed
                                        ? "main-sider-layout"
                                        : "main-sider-layout fullscreen"
                                }
                                hasSider
                            >
                                <SiderMenu
                                    setCollapsed={setCollapsed}
                                    collapsed={collapsed}
                                    pathName={pathName}
                                />
                                <Layout className="main-content-layout">
                                    <Content>{children}</Content>

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
                    </UserProvider>
                </ConfigProvider>
            </body>
        </html>
    );
}
