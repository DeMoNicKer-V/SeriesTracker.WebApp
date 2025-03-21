"use client";
import React, { useEffect, useState } from "react";
import {
    UserOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Flex,
    Input,
    Row,
    Typography,
    Divider,
    Breadcrumb,
    Tooltip,
    Modal,
    ConfigProvider,
    notification,
} from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Paragraph from "antd/es/typography/Paragraph";
import MainEditUserForm from "@/app/components/UserComponents/MainEditUserForm";
import PageErrorView from "@/app/components/PageErrorVIew";
import {
    defaultUserValues,
    MainUserInfo,
} from "@/app/Models/User/MainUserInfo";
import { deleteUserSeries } from "@/app/api/user/deleteUser";
import { getUserByUsername } from "@/app/api/user/getUser";
import { getDecodedUserToken } from "@/app/utils/cookie";
dayjs.locale("ru");

const { Text, Title } = Typography;
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    const [messageApi, contextHolder] = notification.useNotification();
    const [user, setUser] = useState<MainUserInfo | null>(defaultUserValues);
    const [error, setError] = useState<boolean | null>(null);
    const [deleteStr, setDeleteStr] = useState<string>("");
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    const getUser = async () => {
        const token = await getDecodedUserToken();
        if (token?.userName !== params.username) {
            setError(true);
            return;
        }
        const potentialUser = await getUserByUsername(params.username);
        setUser(potentialUser);
        setError(false);
    };

    const deleteUser = async () => {
        setOpenDeleteUser(false);
        await deleteSelfAccount(params.username);
        window.location.href = `/login`;
    };

    const deleteSeriesByUser = async () => {
        setOpenDelete(false);
        await deleteUserSeries(params.username);
    };
    useEffect(() => {
        getUser();
    }, []);

    const onClose = () => {
        setOpenDelete(false);
        setOpenDeleteUser(false);
        setDeleteStr("");
    };

    return (
        <div className="container">
            {contextHolder}
            {error === false && (
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
                            <MainEditUserForm
                                user={user}
                                messageApi={messageApi}
                            />
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
            )}
            {error === true && (
                <PageErrorView text="У вас нет доступа к данной странице" />
            )}
        </div>
    );
}
function deleteSelfAccount(username: string) {
    throw new Error("Function not implemented.");
}
