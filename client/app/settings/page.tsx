"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Carousel,
    Col,
    ColorPicker,
    Flex,
    notification,
    Popconfirm,
    Row,
    Segmented,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import type { TableProps } from "antd";
import { getCategoryList, updateCategoryById } from "../services/category";
import { LongLeftArrow } from "../img/LongLeftArrow";
import {
    EyeOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { CarouselRef } from "antd/es/carousel";
import { getUserList } from "../services/user";

export default function SettingsPage() {
    const [api, contextHolder] = notification.useNotification();
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const getCategories = async () => {
        const category = await getCategoryList();
        const users = await getUserList();
        setCategories(category);
        setUsers(users);
    };

    const updateCategory = async (record: Category, color: string) => {
        if (!color) {
            return;
        }
        await openNotification(record, color);
    };

    const returnColor = async (record: Category, prevColor: string) => {
        if (!prevColor) {
            return;
        }
        await updateCategoryById(record.id, prevColor);
        await getCategories();
    };
    useEffect(() => {
        getCategories();
    }, []);

    const openNotification = async (record: Category, color: string) => {
        const key = `open-confirm-notify`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => api.destroy()}>
                    Нет
                </Button>
                <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                        await updateCategoryById(record.id, color);
                        await getCategories();
                        api.destroy(key);
                    }}
                >
                    Подтвердить
                </Button>
            </Space>
        );
        api.open({
            message: `Цвет категории '${record.name}' будет изменен`,
            description: (
                <Flex gap={10} justify="center" align="center">
                    <Tag style={{ cursor: "default", margin: 0 }} color={color}>
                        {color.toUpperCase()}
                    </Tag>
                    <LongLeftArrow />
                    <Tag style={{ cursor: "default" }} color={record.color}>
                        {record.color.toUpperCase()}
                    </Tag>
                </Flex>
            ),
            btn,
            key,
            showProgress: true,
            pauseOnHover: true,
        });
    };

    const categoryColumns: TableProps<Category>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Цвет",
            dataIndex: "color",
            key: "color",
            render: (_, record) => (
                <Flex
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {contextHolder}
                    <ColorPicker
                        defaultValue={record.color}
                        onChangeComplete={async (color) => {
                            await updateCategory(record, color.toHexString());
                        }}
                    >
                        <Tooltip title={"Нажмите, чтобы изменить"}>
                            <Tag
                                style={{ cursor: "pointer" }}
                                color={record.color}
                            >
                                {record.color.toUpperCase()}
                            </Tag>
                        </Tooltip>
                    </ColorPicker>
                    <Tooltip title={"Вернуть пред. цвет"}>
                        <Popconfirm
                            icon={<QuestionCircleOutlined />}
                            title={`Категория: ${record.name}`}
                            description="Вы уверены, что хотите вернуть предыдущий цвет?"
                            onConfirm={() => {
                                returnColor(record, record.prevColor);
                            }}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                disabled={!record.prevColor}
                                style={{ height: 22 }}
                                type="text"
                                size="small"
                                icon={<LongLeftArrow />}
                            ></Button>
                        </Popconfirm>
                    </Tooltip>
                </Flex>
            ),
        },
        {
            title: "Пред. цвет",
            dataIndex: "prevColor",
            key: "prevColor",

            render: (_, record) => (
                <Tag style={{ cursor: "pointer" }} color={record.prevColor}>
                    {record.prevColor
                        ? record.prevColor.toUpperCase()
                        : "Отсутствует"}
                </Tag>
            ),
        },
        {
            title: "Дата изменения",
            dataIndex: "date",
            key: "date",
            showSorterTooltip: false,
            sorter: (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            render: (_, record) =>
                new Date(record.date).toLocaleString("ru-Ru", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
    ];
    const userColumn: TableProps<User>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "UserName",
            dataIndex: "userName",
            key: "userName",
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Дата регистрации",
            dataIndex: "registrationDate",
            key: "registrationDate",
            showSorterTooltip: false,
            sorter: (a, b) =>
                new Date(a.registrationDate).getTime() -
                new Date(b.registrationDate).getTime(),
            render: (_, record) =>
                new Date(record.registrationDate).toLocaleString("ru-Ru", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
    ];

    return (
        <div className="container">
            <title>Series Tracker - Настройки</title>
            <Row gutter={[20, 20]} align={"middle"} justify={"center"}>
                <Col span={22}>
                    <Tabs
                        animated
                        defaultActiveKey="category"
                        centered
                        items={[
                            {
                                label: "Список категорий",
                                key: "category",
                                icon: <EyeOutlined />,
                                children: (
                                    <Table
                                        pagination={false}
                                        columns={categoryColumns}
                                        dataSource={categories}
                                    />
                                ),
                            },
                            {
                                label: "Список пользователей",
                                key: "user",
                                icon: <TeamOutlined />,
                                children: (
                                    <Table
                                        pagination={false}
                                        columns={userColumn}
                                        dataSource={users}
                                    />
                                ),
                            },
                        ]}
                    />
                </Col>
            </Row>
        </div>
    );
}
