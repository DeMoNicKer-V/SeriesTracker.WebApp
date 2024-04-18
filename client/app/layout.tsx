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
                <Layout style={{ minHeight: "100vh" }}>
                    <Header>
                        {" "}
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
                    </Header>
                    <Layout hasSider>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
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
                            <Content style={{ padding: "0 48px" }}>
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
