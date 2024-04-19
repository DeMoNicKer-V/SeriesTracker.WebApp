"use client";
import React, { useState } from "react";
import "./globals.css";
import { Button, Layout, Menu, theme } from "antd";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    VideoCameraOutlined,
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
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <html lang="en">
            <body>
                <Layout
                    style={{
                        minHeight: "100vh",
                    }}
                >
                    <Header
                        style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
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
                        <SearchBar />
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
                            }}
                        >
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={["series"]}
                                items={[
                                    {
                                        key: "series",
                                        icon: <VideoCameraOutlined />,
                                        label: (
                                            <Link href={"/series"}>Series</Link>
                                        ),
                                    },
                                ]}
                            />
                        </Sider>
                        <Layout>
                            <Content
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                {children}
                            </Content>
                            <Footer style={{ textAlign: "left" }}>
                                <AZList />
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </body>
        </html>
    );
}
