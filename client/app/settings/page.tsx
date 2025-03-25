// settings/page.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Col, ConfigProvider, Row, Tabs } from "antd";
import { BorderlessTableOutlined, TeamOutlined } from "@ant-design/icons";
import { EmptyView } from "../components/EmptyView";
import PageErrorView from "../components/PageErrorVIew";
import { Category } from "../Models/Category";
import { getAllCategoriesList } from "../api/category/getCategory";
import { getAllUsersList } from "../api/user/getUser";
import { deleteUser } from "../api/user/deleteUser";
import { getDecodedUserToken, UserToken } from "../utils/cookie";
import Loading from "../components/Loading";
import { UsersList } from "../Models/User/UsersList";
import DeleteUserModal from "../components/Modals/DeleteUserModal";
import CategoryTable from "../components/SettingsComponents/CategoryTable";
import UserTable from "../components/SettingsComponents/UserTable";

export default function SettingsPage() {
    const allowedRoles = ["1", "2"];
    const [error, setError] = useState<boolean | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [usersData, setUsersData] = useState<UsersList>();
    const [userToken, setUserToken] = useState<UserToken>({
        userName: "",
        userId: "",
        roleId: "",
    });
    const [page, setPage] = useState<number>(1);
    const [deleteUserUserName, setDeleteUserUserName] = useState<string>("");
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    const onDeleteUser = async () => {
        await deleteUser(deleteUserUserName);
        window.location.reload();
    };

    const onClose = () => {
        setOpenDeleteUser(false);
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

            setUserToken(token);
            const category = await getAllCategoriesList();
            setCategories(category);
            setError(false);
        };
        start();
    }, []);

    const updateUsers = useCallback(async () => {
        const usersData = await getAllUsersList(page);
        setUsersData(usersData);
    }, [page]);

    useEffect(() => {
        updateUsers();
    }, [updateUsers]);

    if (error === null) {
        return <Loading loading />;
    }

    return error === false ? (
        <div className="container">
            <ConfigProvider
                renderEmpty={() => (
                    <EmptyView
                        text={"Ничего не найдено"}
                        iconSize={20}
                        fontSize={16}
                    />
                )}
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
                                        <CategoryTable
                                            categories={categories}
                                        />
                                    ),
                                },
                                {
                                    label: "Список пользователей",
                                    key: "user",
                                    icon: <TeamOutlined />,
                                    children: (
                                        <UserTable
                                            usersData={usersData}
                                            userToken={userToken}
                                            setPage={setPage}
                                            setDeleteUserName={
                                                setDeleteUserUserName
                                            }
                                            setOpenDeleteModal={
                                                setOpenDeleteUser
                                            }
                                        />
                                    ),
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </ConfigProvider>
            <DeleteUserModal
                onOk={onDeleteUser}
                onCancel={onClose}
                open={openDeleteUser}
                title={`Удалить пользователя '${deleteUserUserName}'`}
            />
        </div>
    ) : (
        <PageErrorView text="У вас нет доступа к данной странице" />
    );
}
