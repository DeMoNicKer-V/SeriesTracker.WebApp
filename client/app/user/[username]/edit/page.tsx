"use client";
import { deleteSelfUser, deleteUserSeries } from "@/app/api/user/deleteUser";
import ConditionalContent from "@/app/components/ConditionalContent";
import DeleteModal from "@/app/components/Modals/DeleteModal";
import PageErrorView from "@/app/components/PageErrorVIew";
import UserFormMain from "@/app/components/UserComponents/UserFormMain";
import { useUser } from "@/app/components/UserContext";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import {
    Breadcrumb,
    Button,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    notification,
    Row,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Link from "next/link";
import { useEffect, useState } from "react";
dayjs.locale("ru");

//  Основной компонент EditUserPage (страница редактирования профиля пользователя)
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    //  Получаем информацию о текущем пользователе из контекста
    const { user } = useUser();

    //  Создаем экземпляр для отображения уведомлений
    const [messageApi, contextHolder] = notification.useNotification();

    //  Состояние для отображения ошибок
    const [error, setError] = useState<boolean | null>(null);

    //  Состояние для управления видимостью модального окна подтверждения удаления списка аниме
    const [openDeleteList, setOpenDeleteList] = useState<boolean>(false);

    //  Состояние для управления видимостью модального окна подтверждения удаления аккаунта
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    //  Асинхронная функция для удаления аккаунта пользователя
    const handleDeleteUser = async () => {
        setOpenDeleteUser(false);
        await deleteSelfUser(params.username);

        //  Перенаправляем пользователя на страницу логина
        window.location.href = `/login`;
    };

    //  Асинхронная функция для удаления списка аниме пользователя
    const handleDeleteAnimeList = async () => {
        setOpenDeleteList(false);
        await deleteUserSeries(params.username);
    };

    //  Эффект, который запускается при монтировании компонента
    useEffect(() => {
        const getUser = async () => {
            if (user?.userName !== params.username) {
                setError(true);
                return;
            }
            setError(false); //  Сбрасываем ошибку, если имена совпадают
        };

        getUser();
    }, [user, params.username]);

    return (
        <ConditionalContent
            condition={error}
            onErrorNode={
                <PageErrorView text="У вас нет доступа к данной странице" />
            }
        >
            <div className="container">
                {contextHolder}

                <ConfigProvider
                    theme={{
                        components: {
                            Card: {
                                colorBgContainer: "transparent",
                                padding: 24,
                            },
                        },
                    }}
                >
                    <title>{`${params.username} / Редактирование`}</title>
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link href={"./"}>
                                        <Flex justify="center" gap={5}>
                                            <UserOutlined /> {params.username}
                                        </Flex>
                                    </Link>
                                ),
                            },

                            {
                                title: "Редактирование профиля",
                            },
                        ]}
                    />
                    <Row justify={"center"} align={"middle"}>
                        <Col>
                            <UserFormMain user={user} messageApi={messageApi} />
                            <Divider orientation="left">
                                <Flex gap={10}>
                                    Дополнительные настройки{" "}
                                    <Tooltip title={"Будьте внимательными"}>
                                        <WarningOutlined />{" "}
                                    </Tooltip>
                                </Flex>
                            </Divider>
                            <Flex
                                justify="center"
                                gap={15}
                                style={{ flexDirection: "column" }}
                            >
                                <Button
                                    onClick={() => setOpenDeleteList(true)}
                                    ghost
                                    type="primary"
                                    danger
                                >
                                    Очистить мои списки
                                </Button>

                                <Button
                                    onClick={() => setOpenDeleteUser(true)}
                                    ghost
                                    type="primary"
                                    danger
                                >
                                    Удалить аккаунт
                                </Button>
                            </Flex>
                        </Col>
                    </Row>
                    <DeleteModal
                        open={openDeleteList}
                        title="Удалить Ваш список аниме?"
                        onConfirm={handleDeleteAnimeList}
                        onCancel={() => setOpenDeleteList(false)}
                    />
                    <DeleteModal
                        open={openDeleteUser}
                        title="Удалить Ваш Аккаунт?"
                        onConfirm={handleDeleteUser}
                        onCancel={() => setOpenDeleteUser(false)}
                    />
                </ConfigProvider>
            </div>
        </ConditionalContent>
    );
}
