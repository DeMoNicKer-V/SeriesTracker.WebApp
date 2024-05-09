"use client";
import React, { useState } from "react";
import "./globals.css";
import { Button, ConfigProvider, Layout, Menu, Switch, theme } from "antd";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    VideoCameraOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import Link from "next/link";
import { AZList } from "./components/azList";
import SearchBar from "./components/searchbar";

const { Header, Content, Sider } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const [collapsed2, setCollapsed2] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(false);
    const darkTheme = {
        colorPrimary: "#DE1EB2",
        colorInfo: "#DE1EB2",
    };

    const darkThemeLayout = {
        Layout: {
            headerBg: "#101010",
            footerBg: "#101010",
            siderBg: "#101010",
            bodyBg: "#0f0f0f",
        },
        Menu: {
            activeBarBorderWidth: 0,
        },
    };

    const lightTheme = {};

    return (
        <html lang="en">
            <body>
                <div id={"STRACKER"}>
                    <div id={"__layout"}>
                        <ConfigProvider
                            theme={{
                                token: currentTheme ? darkTheme : lightTheme,
                                algorithm: currentTheme
                                    ? theme.darkAlgorithm
                                    : theme.defaultAlgorithm,

                                components: darkThemeLayout,
                            }}
                        >
                            <Layout>
                                <Header
                                    style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        height: 64,
                                        marginTop: 0,
                                        transform: "translateY(0px)",
                                        left: "0px",
                                        right: "0px",
                                        boxShadow:
                                            "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                                    }}
                                >
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
                                    <div className="spacer" />
                                    <SearchBar />
                                    <div className="spacer" />
                                    <Switch
                                        checkedChildren={<MoonOutlined />}
                                        unCheckedChildren={<SunOutlined />}
                                        onChange={(checked: any) => {
                                            setCurrentTheme(checked);
                                        }}
                                    />
                                </Header>
                                <Layout
                                    style={{
                                        padding: 10,
                                    }}
                                >
                                    <Sider
                                        trigger={null}
                                        collapsible
                                        collapsed={collapsed}
                                        style={{
                                            height: "90vh",
                                            maxHeight: "calc(100% - 80px)",
                                            position: "sticky",
                                            top: "80px",
                                            transform: "translateX(0%)",
                                            padding: "4px",
                                            boxShadow:
                                                "0 2px 4px -1px rgba(0,0,0,.3), 0 4px 5px 0 rgba(0,0,0,.24), 0 1px 10px 0 rgba(0,0,0,.22)",
                                        }}
                                    >
                                        <Menu
                                            mode="inline"
                                            defaultSelectedKeys={["series"]}
                                            items={[
                                                {
                                                    key: "series",
                                                    icon: (
                                                        <VideoCameraOutlined />
                                                    ),
                                                    label: (
                                                        <Link href={"/series"}>
                                                            Series
                                                        </Link>
                                                    ),
                                                },
                                                {
                                                    key: "home",
                                                    icon: (
                                                        <VideoCameraOutlined />
                                                    ),
                                                    label: (
                                                        <Link href={"/home"}>
                                                            Home
                                                        </Link>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Sider>
                                    <Layout>
                                        <Content>{children}</Content>
                                        <Footer
                                            style={{
                                                textAlign: "left",
                                            }}
                                        >
                                            <AZList />
                                        </Footer>
                                    </Layout>
                                    {/* <Sider
                            width={400}
                            trigger={null}
                            collapsible
                            collapsed={collapsed2}
                            style={{
                                height: "90vh",
                                maxHeight: "calc(100% - 80px)",
                                position: "sticky",
                                top: "80px",
                                transform: "translateX(0%)",
                            }}
                        ></Sider>*/}
                                </Layout>
                            </Layout>
                        </ConfigProvider>
                    </div>
                </div>
            </body>
        </html>
    );
}
