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
    Switch,
    theme,
} from "antd";

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
import { getCookie, setCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";

const { Header, Content, Sider } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const [collapsed2, setCollapsed2] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(false);

    useEffect(() => {
        const colorThemeCookie = getCookie("theme");
        const vv = colorThemeCookie === "false" ? false : true;
        setCurrentTheme(vv);
    }, []);
    const darkTheme = {
        colorPrimary: "#DE1EB2",
        colorInfo: "#DE1EB2",
        marginLG: "5px 0 24px",
    };

    const setColorThemeCookie = (value: boolean) => {
        setCurrentTheme(value);
        setCookie("theme", value);
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
                                                onClick={() =>
                                                    setCollapsed(!collapsed)
                                                }
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
                                            <SearchBar />{" "}
                                        </Col>
                                        <Col span={6}>
                                            <div className="spacer" />{" "}
                                        </Col>
                                        <Col span={1}>
                                            <Switch
                                                checked={currentTheme}
                                                checkedChildren={
                                                    <MoonOutlined />
                                                }
                                                unCheckedChildren={
                                                    <SunOutlined />
                                                }
                                                onChange={(checked: any) => {
                                                    setColorThemeCookie(
                                                        checked
                                                    );
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
                                                },
                                            ]}
                                        />
                                    </Sider>
                                    <Layout>
                                        <Content style={{ padding: 30 }}>
                                            {children}
                                        </Content>
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
