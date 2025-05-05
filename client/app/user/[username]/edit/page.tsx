"use client";
import { deleteSelfUser, deleteUserSeries } from "@/app/api/user/deleteUser";
import ConditionalContent from "@/app/components/ConditionalContent";
import PageErrorView from "@/app/components/PageErrorVIew";
import UserFormMain from "@/app/components/UserComponents/UserFormMain";
import { useUser } from "@/app/components/UserContext";

import {
    QuestionCircleOutlined,
    UploadOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    Button,
    Col,
    ConfigProvider,
    Divider,
    Flex,
    Input,
    Modal,
    notification,
    Row,
    Tooltip,
    Typography,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Link from "next/link";
import { useEffect, useState } from "react";
dayjs.locale("ru");

const { Text, Title } = Typography;

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

    //  Состояние для хранения строки подтверждения удаления
    const [deleteStr, setDeleteStr] = useState<string>("");

    //  Состояние для управления видимостью модального окна подтверждения удаления списка аниме
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    //  Состояние для управления видимостью модального окна подтверждения удаления аккаунта
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    //  Асинхронная функция для проверки, соответствует ли отображаемый профиль профилю текущего пользователя
    const getUser = async () => {
        if (user?.userName !== params.username) {
            setError(true);
            return;
        }
        setError(false); //  Сбрасываем ошибку, если имена совпадают
    };

    //  Асинхронная функция для удаления аккаунта пользователя
    const deleteUser = async () => {
        setOpenDeleteUser(false);
        await deleteSelfUser(params.username);

        //  Перенаправляем пользователя на страницу логина
        window.location.href = `/login`;
    };

    //  Асинхронная функция для удаления списка аниме пользователя
    const deleteSeriesByUser = async () => {
        setOpenDelete(false);
        await deleteUserSeries(params.username);
    };

    //  Эффект, который запускается при монтировании компонента
    useEffect(() => {
        getUser();
    }, []); //  Зависимости пустые, эффект выполняется один раз при монтировании

    //  Функция для закрытия модальных окон и очистки строки подтверждения
    const onClose = () => {
        setOpenDelete(false);
        setOpenDeleteUser(false);
        setDeleteStr("");
    };

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
                                    onClick={() => setOpenDelete(true)}
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
                    <Modal
                        onOk={deleteSeriesByUser}
                        centered
                        onCancel={onClose}
                        closeIcon={false}
                        open={openDelete}
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
                                <Title level={5}>
                                    Удалить все ваши данные?
                                </Title>
                            </Flex>
                        }
                        footer={(_, { OkBtn, CancelBtn }) => (
                            <>
                                <Flex gap={10}>
                                    <Button
                                        icon={<UploadOutlined />}
                                        style={{ marginRight: "auto" }}
                                    ></Button>
                                    <CancelBtn />
                                    <OkBtn />
                                </Flex>
                            </>
                        )}
                    >
                        <Flex style={{ flexDirection: "column" }} gap={10}>
                            <Paragraph>
                                Будьте внимательны, это необратимое действие!{" "}
                                <br />
                                Убедитесь, что Вы экспортировали свои данные
                                заранее.
                                <br />
                                Для того, чтобы удалить данные, введите в поле
                                ниже - (
                                <Text type="danger" code strong>
                                    УДАЛИТЬ
                                </Text>
                                ) .
                            </Paragraph>

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
                                <Title level={5}>Удалить Ваш Аккаунт?</Title>
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
                            <Paragraph>
                                Будьте внимательны, это необратимое действие!{" "}
                                <br />
                                Для того, чтобы удалить аккаунт, введите в поле
                                ниже - (
                                <Text type="danger" code strong>
                                    УДАЛИТЬ
                                </Text>
                                ) .
                            </Paragraph>

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
        </ConditionalContent>
    );
}
