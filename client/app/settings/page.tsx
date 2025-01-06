"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Carousel,
    Col,
    ColorPicker,
    ConfigProvider,
    Flex,
    Input,
    Modal,
    notification,
    Popconfirm,
    Radio,
    Row,
    Segmented,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import type { RadioChangeEvent, TableProps } from "antd";
import { getCategoryList, updateCategoryById } from "../services/category";
import { LongLeftArrow } from "../img/LongLeftArrow";
import {
    DeleteOutlined,
    EyeOutlined,
    LinkOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { CarouselRef } from "antd/es/carousel";
import {
    changeUserRole,
    deleteUserByUsername,
    getUserList,
} from "../services/user";
import { GetCoockie, GetPermissions } from "../api/coockie";

export default function SettingsPage() {
    const [error, setError] = useState<boolean>(false);

    const userRoles = [
        {
            value: 2,
            label: "Модер",
        },
        { value: 3, label: "Юзер" },
    ];
    const [api, contextHolder] = notification.useNotification();
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | any>({
        id: "",
        roleId: 0,
    });
    const [deleteUserUsername, setDeleteUserUsername] = useState<string>("");
    const [deleteStr, setDeleteStr] = useState<string>("");
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
    const getCategories = async () => {
        const currentUser = await GetPermissions(2);
        setError(true);
        setCurrentUser(currentUser);
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

    const deleteUser = async () => {
        await deleteUserByUsername(deleteUserUsername);
        window.location.reload();
    };

    const openDeleteModal = (username: string) => {
        setDeleteUserUsername(username);
        setOpenDeleteUser(true);
    };

    const onClose = () => {
        setOpenDeleteUser(false);
        setDeleteStr("");
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

    const onChange = async (userId: string, e: RadioChangeEvent) => {
        await changeUserRole(userId, e.target.value);
        window.location.reload();
    };

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
            sorter: (a, b) => b.id - a.id,
            showSorterTooltip: false,
        },
        {
            fixed: "left",
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
    const handleRoleChange = (value: any, record: any) => {
        // Обработка изменения роли
        // Например, обновление данных в базе данных
    };
    const userColumn: TableProps<User>["columns"] = [
        {
            fixed: "left",
            title: "Никнейм",
            dataIndex: "userName",
            key: "userName",
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Роль",
            dataIndex: "roleId",
            key: "roleId",
            showSorterTooltip: false,
            sorter: (a, b) => b.roleId - a.roleId,
            render: (roleId, record) => (
                <Radio.Group
                    key={record.id}
                    optionType="button"
                    onChange={(e) => onChange(record.id, e)}
                    defaultValue={roleId}
                    options={
                        roleId === 1
                            ? [{ value: 1, label: "Админ" }]
                            : [
                                  {
                                      value: 2,
                                      label: "Модер",
                                      disabled: currentUser.roleId != 1,
                                  },
                                  {
                                      value: 3,
                                      label: "Юзер",
                                      disabled: currentUser.roleId != 1,
                                  },
                              ]
                    }
                />
            ),
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
        {
            fixed: "right",
            title: "Действия",
            key: "action",
            render: (_, record) => (
                <Space size={"small"}>
                    <Button
                        target="_blank"
                        href={`user/${record.userName}`}
                        size="small"
                        icon={<EyeOutlined />}
                    />
                    {record.id !== currentUser.userId &&
                        record.roleId > currentUser.roleId && (
                            <Button
                                danger
                                onClick={() => openDeleteModal(record.userName)}
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        )}
                </Space>
            ),
        },
    ];

    return error === true ? (
        <div className="container">
            <ConfigProvider
                theme={{
                    components: {
                        Segmented: { colorTextDisabled: "#ffffffd9" },
                    },
                }}
            >
                <title>Series Tracker - Настройки</title>
                <Row gutter={[20, 20]} align={"middle"} justify={"center"}>
                    <Col span={23}>
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
                                            rowKey="name"
                                            scroll={{ x: "max-content" }}
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
                                            rowKey="userName"
                                            scroll={{ x: "max-content" }}
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
                <Modal
                    centered
                    onOk={deleteUser}
                    onCancel={onClose}
                    closeIcon={false}
                    open={openDeleteUser}
                    cancelText="Нет"
                    okText="Удалить"
                    okButtonProps={{
                        danger: true,
                        disabled: deleteStr !== "УДАЛИТЬ",
                    }}
                    title={
                        <Flex gap={10}>
                            <QuestionCircleOutlined
                                style={{ color: "orange" }}
                            />
                            <Typography.Title level={5}>
                                Удалить {deleteUserUsername}?
                            </Typography.Title>
                        </Flex>
                    }
                    footer={(_, { OkBtn, CancelBtn }) => (
                        <>
                            <CancelBtn />
                            <OkBtn />
                        </>
                    )}
                >
                    <Flex style={{ flexDirection: "column" }} gap={10}>
                        <Typography.Paragraph>
                            Будьте внимательны, это необратимое действие! <br />
                            Для того, чтобы удалить аккаунт, введите в поле ниже
                            - (
                            <Typography.Text type="danger" code strong>
                                УДАЛИТЬ
                            </Typography.Text>
                            ) .
                        </Typography.Paragraph>

                        <Input
                            onChange={(e) => setDeleteStr(e.target.value)}
                            value={deleteStr}
                            spellCheck={false}
                            status="error"
                            size="small"
                            style={{
                                textAlign: "center",
                                fontSize: 16,
                                fontWeight: 500,
                            }}
                        />
                    </Flex>
                </Modal>
            </ConfigProvider>
        </div>
    ) : (
        <p>У вас нет доступа к данной странице</p>
    );
}
