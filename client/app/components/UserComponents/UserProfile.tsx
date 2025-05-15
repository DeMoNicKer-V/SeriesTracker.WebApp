"use client";

import { logout } from "@/app/api/auth";
import {
    BookOutlined,
    EditOutlined,
    LogoutOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./component.module.css";

// Определение интерфейса Props для компонента UserProfile
interface Props {
    user: User | undefined;
}

/**
 * @component UserProfile
 * @description Компонент для отображения профиля пользователя в виде выпадающего меню.
 * Предоставляет ссылки на профиль пользователя, список аниме, настройки и возможность выхода из системы.
 * @param {Props} props - Объект с пропсами компонента.
 * @returns {JSX.Element}
 */
const UserProfile: React.FC<Props> = ({ user }): JSX.Element => {
    const path = usePathname();
    // Определение пунктов меню для Dropdown
    const items: MenuProps["items"] = [
        {
            label: user?.email, // Email пользователя (отображается в меню)
            key: "0",
            className: styles["user-profile-disabled"], // CSS-класс для отключенных элементов
            icon: <MailOutlined />, // Иконка email
            disabled: true, // Отключаем пункт меню (нельзя выбрать)
        },
        {
            label: <Divider className="zero-margin" />,
            className: styles["user-profile-disabled"],
            key: "divider",
            disabled: true,
        },
        {
            label: (
                // Ссылка на профиль пользователя
                <Link href={`/user/${user?.userName}`}>Профиль</Link>
            ),
            key: "1",
            icon: <UserOutlined />,
        },
        {
            label: (
                // Ссылка на список аниме пользователя
                <Link href={`/user/${user?.userName}/list`}>Мои аниме</Link>
            ),
            key: "2",
            icon: <BookOutlined />,
        },
        {
            label: (
                // Ссылка на настройки пользователя
                <Link href={`/user/${user?.userName}/edit`}>Редактировать</Link>
            ),
            key: "3",
            icon: <EditOutlined />,
        },
        {
            label: "Выйти", // Пункт меню для выхода из системы
            key: "4",
            onClick: async () => {
                // Обработчик клика
                await logout(user?.userName);
                window.location.href = "/login";
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
                                className={styles["user-profile-dropdown"]}
                                size={[20, 20]}
                            >
                                <Avatar
                                    className={styles["user-profile-avatar"]}
                                    size={40}
                                    shape="circle"
                                    src={user?.avatar}
                                ></Avatar>
                                <Typography.Title
                                    level={5}
                                    className={
                                        path.includes(user.userName)
                                            ? styles["active"]
                                            : ""
                                    }
                                >
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
