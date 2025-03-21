"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
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
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import type { RadioChangeEvent, TableColumnType, TableProps } from "antd";
import { LongLeftArrow } from "../img/LongLeftArrow";
import {
    BorderlessTableOutlined,
    CloseOutlined,
    DeleteOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    TeamOutlined,
} from "@ant-design/icons";

import { FilterDropdownProps } from "antd/es/table/interface";
import { EmptyView } from "../components/EmptyView";
import PageErrorView from "../components/PageErrorVIew";
import { Category } from "../Models/Category";
import { getAllCategoriesList } from "../api/category/getCategory";
import { editCategoryColor } from "../api/category/editCategory";
import { getAllUsersList } from "../api/user/getUser";
import { deleteUser } from "../api/user/deleteUser";
import { changeUserRole } from "../api/user/editUser";
import { getDecodedUserToken, UserToken } from "../utils/cookie";
import Loading from "../components/Loading";
import { UserItem, UsersList } from "../Models/User/UsersList";

export default function SettingsPage() {
    const [error, setError] = useState<boolean | null>(null); // Инициализируем null
    const allowedRoles = ["1", "2"];

    const [api, contextHolder] = notification.useNotification();
    const [categories, setCategories] = useState<Category[]>([]);
    const [usersData, setUsersData] = useState<UsersList>();
    const [userToken, setUserToken] = useState<UserToken>({
        userName: "",
        userId: "",
        roleId: "",
    });
    const [page, setPage] = useState<number>(1);
    const [deleteUserUsername, setDeleteUserUsername] = useState<string>("");
    const [deleteStr, setDeleteStr] = useState<string>("");
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
    const getCategories = async () => {
        const token: UserToken | null = await getDecodedUserToken();

        if (!token || !["1", "2"].includes(token.roleId)) {
            // Куки отсутствует или токен недействителен
            console.warn("Отсутствует JWT токен.");
            return;
        }
        setError(false);
        setUserToken(token);
    };

    const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
        confirm();
    };

    const handleReset = (
        clearFilters: () => void,
        confirm: FilterDropdownProps["confirm"]
    ) => {
        clearFilters();
        confirm();
    };

    const updateCategory = async (record: Category, color: string) => {
        if (!color) {
            return;
        }
        await openNotification(record, color);
    };

    const onDeleteUser = async () => {
        await deleteUser(deleteUserUsername);
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
        await editCategoryColor(record.id, prevColor);
        window.location.reload();
    };
    useEffect(() => {
        const start = async () => {
            const token: UserToken | null = await getDecodedUserToken();

            if (!token) {
                console.warn("Отсутствует JWT токен.");
                setError(true);
                return;
            }

            if (!allowedRoles.includes(token.roleId)) {
                console.warn(
                    `У пользователя roleId "${token.roleId}" нет прав доступа.`
                );
                setError(true);
                return;
            }

            setError(false); // Если все проверки пройдены
            setUserToken(token);
            const category = await getAllCategoriesList();
            const usersData = await getAllUsersList(page);
            setCategories(category);
            setUsersData(usersData);
        };
        start();
    }, []);

    useEffect(() => {
        const updateUsers = async () => {
            const usersData = await getAllUsersList(page);

            setUsersData(usersData);
        };
        updateUsers();
    }, [page]);

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
                        await editCategoryColor(record.id, color);
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

    const getColumnSearchProps = (): TableColumnType<UserItem> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={"Введите для поиска"}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(confirm)}
                    style={{ marginBottom: 10 }}
                />
                <Flex justify="space-between">
                    <Button
                        onClick={() => handleSearch(confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        Поиск
                    </Button>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm)
                        }
                        size="small"
                    ></Button>
                </Flex>
            </div>
        ),
        filterIcon: <SearchOutlined />,
        onFilter: (value, record) =>
            record.userName
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
    });
    const userColumn: TableProps<UserItem>["columns"] = [
        {
            fixed: "left",
            title: "Никнейм",
            dataIndex: "userName",
            key: "userName",
            ...getColumnSearchProps(),
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
                                      disabled: Number(userToken.roleId) != 1,
                                  },
                                  {
                                      value: 3,
                                      label: "Юзер",
                                      disabled: Number(userToken.roleId) != 1,
                                  },
                              ]
                    }
                />
            ),
        },
        {
            title: "Дата регистрации",
            dataIndex: "regDate",
            key: "regDate",
            showSorterTooltip: false,
            sorter: (a, b) =>
                new Date(a.regDate).getTime() - new Date(b.regDate).getTime(),
            render: (_, record) =>
                new Date(record.regDate).toLocaleString("ru-Ru", {
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
                    {record.id !== userToken.userId &&
                        record.roleId > Number(userToken.roleId) && (
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

    const customizeRenderEmpty = () => (
        <EmptyView text={"Ничего не найдено"} iconSize={20} fontSize={16} />
    );

    if (error === null) {
        return <Loading loading />; // Пока идет проверка
    }

    return error === false ? (
        <div className="container">
            <ConfigProvider
                renderEmpty={customizeRenderEmpty}
                theme={{
                    components: {
                        Tabs: { fontSize: 16 },
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
                                    icon: <BorderlessTableOutlined />,
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
                                            pagination={{
                                                defaultPageSize: 10,
                                                position: ["bottomCenter"],
                                                total: usersData?.totalCount,
                                                onChange(page) {
                                                    setPage(page);
                                                },
                                            }}
                                            rowKey="userName"
                                            scroll={{ x: "max-content" }}
                                            columns={userColumn}
                                            dataSource={usersData?.users}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </Col>
                </Row>
                <Modal
                    centered
                    onOk={onDeleteUser}
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
        <PageErrorView text="У вас нет доступа к данной странице" />
    );
}
