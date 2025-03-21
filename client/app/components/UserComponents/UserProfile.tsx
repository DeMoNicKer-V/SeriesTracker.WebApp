"use client";
import {
    Avatar,
    Button,
    Col,
    ConfigProvider,
    Divider,
    Dropdown,
    MenuProps,
    Space,
    Typography,
} from "antd";

import {
    BookOutlined,
    LogoutOutlined,
    MailOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { logout } from "@/app/api/auth";
interface Props {
    user?: User;
}

const UserProfile = ({ user }: Props) => {
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
            label: "Выйти",
            key: "4",
            onClick: async () => {
                await logout();
            },
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Col>
            <ConfigProvider
                theme={{
                    components: {
                        Button: { paddingInline: 0 },
                    },
                }}
            >
                {user ? (
                    <Dropdown menu={{ items }}>
                        <Button type="text" className="height-100">
                            <Space
                                style={{
                                    padding: "0 10px",
                                    alignItems: "end",
                                }}
                                size={[20, 20]}
                            >
                                <Avatar
                                    style={{
                                        borderColor: "#313131",
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
                ) : (
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
                )}
            </ConfigProvider>
        </Col>
    );
};

export default UserProfile;
