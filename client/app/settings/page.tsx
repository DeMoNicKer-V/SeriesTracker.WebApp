// settings/page.tsx
"use client";
import { BorderlessTableOutlined, TeamOutlined } from "@ant-design/icons";
import { Col, ConfigProvider, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getAllCategoriesList } from "../api/category/getCategory";
import { deleteUser } from "../api/user/deleteUser";
import { getAllUsersList } from "../api/user/getUser";
import ConditionalContent from "../components/ConditionalContent";
import { EmptyView } from "../components/EmptyView";
import DeleteUserModal from "../components/Modals/DeleteUserModal";
import PageErrorView from "../components/PageErrorVIew";
import CategoryTable from "../components/SettingsComponents/CategoryTable";
import UserTable from "../components/SettingsComponents/UserTable";
import { useUser } from "../components/UserContext";
import { Category } from "../models/Category";
import { UsersList } from "../models/user/UsersList";

//  Основной компонент SettingsPage (страница настроек)
export default function SettingsPage() {
    //  Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    //  Массив разрешенных ролей (для доступа к странице)
    const allowedRoles = [1, 2];

    //  Состояние для отображения ошибок авторизации
    const [error, setError] = useState<boolean | null>(null);

    //  Состояние для хранения списка категорий
    const [categories, setCategories] = useState<Category[]>([]);

    //  Состояние для хранения данных о пользователях (список)
    const [usersData, setUsersData] = useState<UsersList>();

    //  Состояние для управления номером страницы (для пагинации списка пользователей)
    const [page, setPage] = useState<number>(1);

    //  Состояние для хранения имени пользователя, которого нужно удалить
    const [deleteUserUserName, setDeleteUserUserName] = useState<string>("");

    //  Состояние для управления видимостью модального окна подтверждения удаления пользователя
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    //  Асинхронная функция для удаления пользователя
    const onDeleteUser = async () => {
        await deleteUser(deleteUserUserName); //  Удаляем пользователя
        setPage(1); // Обновляем страницу -> обновляем список пользователей
    };

    //  Функция для закрытия модального окна
    const onClose = () => {
        setOpenDeleteUser(false); //  Закрываем модальное окно
    };

    //  Эффект, который запускается при монтировании компонента
    useEffect(() => {
        const start = async () => {
            if (!user) {
                return; // Ждем, пока user не станет доступен
            }
            try {
                //  Проверяем права доступа
                if (!allowedRoles.includes(user.roleId)) {
                    setError(true); //  Устанавливаем флаг ошибки (недостаточно прав)
                    return;
                }
                //  Получаем список категорий
                const categories = await getAllCategoriesList();
                setCategories(categories);
                setError(false); //  Сбрасываем флаг ошибки (доступ разрешен)
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError(true);
            }
        };
        start(); //  Запускаем асинхронную функцию
    }, [user]);

    //  Функция для обновления списка пользователей
    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await getAllUsersList(page); //  Получаем список пользователей (с учетом текущей страницы)
            setUsersData(usersData);
        };
        fetchUsers();
    }, [page]); //  Зависимости: page (перезапускаем функцию, если изменилась страница)

    return (
        <ConditionalContent
            condition={error}
            onErrorNode={
                <PageErrorView text="У вас нет доступа к данной странице" />
            }
        >
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
                                                user={user}
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
        </ConditionalContent>
    );
}
