"use client";
import React, { useEffect, useState } from "react";
import {
    UserOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    WarningOutlined,
    MinusCircleOutlined,
    EditOutlined,
    CloseOutlined,
    KeyOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Typography,
    message,
    Divider,
    Breadcrumb,
    Tooltip,
    Modal,
    ConfigProvider,
} from "antd";
import {
    checkExistEmail,
    defaultUserValues,
    deleteSeriesByUsername,
    deleteUserByUsername,
    getUserByUserName,
    MainUserInfo,
    updateUser,
    verify,
} from "../../../services/user";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { IsCurrentUser } from "@/app/api/coockie";
import SecondaryEditUserForm from "@/app/components/UserComponents/SecondaryEditUserForm";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
dayjs.locale("ru");

const { Text, Title } = Typography;
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useState<MainUserInfo>(defaultUserValues);
    const [error, setError] = useState<boolean>(false);
    const [deleteStr, setDeleteStr] = useState<string>("");
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
    const [form] = Form.useForm();
    const getUser = async () => {
        if ((await IsCurrentUser(params.username)) === false) {
            return null;
        }

        const potentialUser = await getUserByUserName(params.username);
        setUser(potentialUser);
        form.setFieldsValue(potentialUser); // Устанавливаем начальные значения формы
        form.setFieldValue(
            "dateBirth",
            !potentialUser?.dateBirth ? null : dayjs(potentialUser?.dateBirth)
        );
        setError(true);
    };

    const deleteUser = async () => {
        setOpenDeleteUser(false);
        await deleteUserByUsername(params.username);
    };

    const deleteSeriesByUser = async () => {
        setOpenDelete(false);
        await deleteSeriesByUsername(params.username);
    };
    useEffect(() => {
        getUser();
    }, []);

    const onFinish = async (values: any) => {
        const UserRequest = {
            userName: values["userName"],
            name: values["name"],
            surName: values["surName"],
            email: values["emailPassword"]?.[0].email,
            password:
                values["emailPassword"]?.[0].passwordList?.[0].newPassword,
            avatar: values["avatar"],
            dateBirth: values["dateBirth"]
                ? values["dateBirth"].format("YYYY-MM-DD").toString()
                : "",
        };
        const response = await updateUser(params.username, UserRequest);
        if (response === 200) {
            messageApi
                .open({
                    type: "success",
                    content: "Профиль успешно обновлен!",
                    duration: 1.5,
                })
                .then(() => router.back());

            return;
        }
        messageApi.open({
            type: "error",
            content: `Не удалось обновить пользователя. Ошибка - ${response}`,
        });
    };

    const onClose = () => {
        setOpenDelete(false);
        setOpenDeleteUser(false);
        setDeleteStr("");
    };

    return error === true ? (
        <div className="container">
            {contextHolder}
            <Breadcrumb
                separator=""
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
                        type: "separator",
                    },
                    {
                        title: "Редактирование профиля",
                    },
                ]}
            />
            <Row justify="center" align="middle">
                <Col>
                    <ConfigProvider>
                        <Form
                            spellCheck={false}
                            layout="vertical"
                            onFinish={onFinish}
                            form={form}
                        >
                            <Form.Item
                                noStyle
                                className="width-100"
                                name={"userName"}
                            >
                                <Input
                                    addonAfter={
                                        <Tooltip title="Чувствителен к регистру">
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    }
                                    addonBefore="Никнейм"
                                />
                            </Form.Item>
                            <Divider>{user?.email}</Divider>
                            <SecondaryEditUserForm previewFile={user?.avatar} />

                            <Form.List name="emailPassword">
                                {(fields, { add, remove }) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            rowGap: 16,
                                            flexDirection: "column",
                                        }}
                                    >
                                        {fields.map((field) => (
                                            <Card
                                                className="main-user-info"
                                                bordered={false}
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                }}
                                                size="small"
                                                key={field.key}
                                                extra={
                                                    <CloseOutlined
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                }
                                            >
                                                <Form.Item
                                                    validateDebounce={1500}
                                                    hasFeedback
                                                    style={{ width: "100%" }}
                                                    label={"Новая эл. почта"}
                                                    name={[field.name, "email"]}
                                                    rules={[
                                                        {
                                                            type: "email",
                                                            message:
                                                                "Эл. почта имеет некорректную сигнатуру",
                                                        },
                                                        {
                                                            validator: async (
                                                                _,
                                                                value
                                                            ) => {
                                                                if (!value) {
                                                                    // Проверка на пустоту
                                                                    return Promise.resolve(); // Возвращаем Promise.resolve(), если поле пустое
                                                                }
                                                                // Проверка на стороне сервера
                                                                const exists =
                                                                    await checkExistEmail(
                                                                        value
                                                                    );
                                                                if (exists) {
                                                                    return Promise.reject(
                                                                        new Error(
                                                                            "Этот email уже используется."
                                                                        )
                                                                    );
                                                                }
                                                                // Разрешить регистрацию, если email уникален
                                                                return Promise.resolve();
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Введите новый адрес" />
                                                </Form.Item>

                                                <Form.List
                                                    name={[
                                                        field.name,
                                                        "passwordList",
                                                    ]}
                                                >
                                                    {(subFields, subOpt) => (
                                                        <div>
                                                            {subFields.map(
                                                                (subField) => (
                                                                    <Flex
                                                                        style={{
                                                                            flexDirection:
                                                                                "column",
                                                                        }}
                                                                    >
                                                                        <Form.Item
                                                                            validateDebounce={
                                                                                1500
                                                                            }
                                                                            hasFeedback
                                                                            style={{
                                                                                width: "100%",
                                                                            }}
                                                                            label={
                                                                                "Старый пароль"
                                                                            }
                                                                            name={[
                                                                                subField.name,
                                                                                "oldPassword",
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required:
                                                                                        true,
                                                                                    message:
                                                                                        "Вы дожны подтвердить свой пароль.",
                                                                                },
                                                                                {
                                                                                    validator:
                                                                                        async (
                                                                                            _,
                                                                                            value
                                                                                        ) => {
                                                                                            if (
                                                                                                !value
                                                                                            ) {
                                                                                                // Проверка на пустоту
                                                                                                return Promise.resolve(); // Возвращаем Promise.resolve(), если поле пустое
                                                                                            }
                                                                                            // Проверка на стороне сервера
                                                                                            const exists =
                                                                                                await verify(
                                                                                                    {
                                                                                                        email: user?.email,
                                                                                                        password:
                                                                                                            value,
                                                                                                    }
                                                                                                );
                                                                                            if (
                                                                                                exists
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        "Неверный пароль"
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                            // Разрешить регистрацию, если email уникален
                                                                                            return Promise.resolve();
                                                                                        },
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input.Password placeholder="Введите старый пароль" />
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            validateDebounce={
                                                                                1500
                                                                            }
                                                                            hasFeedback
                                                                            style={{
                                                                                width: "100%",
                                                                            }}
                                                                            label={
                                                                                "Новый пароль"
                                                                            }
                                                                            name={[
                                                                                subField.name,
                                                                                "newPassword",
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required:
                                                                                        true,
                                                                                    message:
                                                                                        "Пароль не может быть пустым.",
                                                                                },
                                                                                {
                                                                                    pattern:
                                                                                        new RegExp(
                                                                                            "^(?=.*[A-Z]|[А-Я])(?=.*).{8,}$|.{15,}$"
                                                                                        ),
                                                                                    message:
                                                                                        "Убедитесь, что пароль содержит не менее 15 символов или не менее 8 символов, включая цифру и строчную букву.",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input.Password placeholder="Введите новый пароль" />
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                justifyContent:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            <MinusCircleOutlined
                                                                                onClick={() =>
                                                                                    subOpt.remove(
                                                                                        subField.name
                                                                                    )
                                                                                }
                                                                            />
                                                                        </Form.Item>
                                                                    </Flex>
                                                                )
                                                            )}
                                                            {subFields.length <
                                                                1 && (
                                                                <Form.Item
                                                                    style={{
                                                                        marginTop: 15,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        type="text"
                                                                        onClick={() =>
                                                                            subOpt.add()
                                                                        }
                                                                        block
                                                                        icon={
                                                                            <KeyOutlined />
                                                                        }
                                                                    >
                                                                        Изменить
                                                                        пароль
                                                                    </Button>
                                                                </Form.Item>
                                                            )}
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </Card>
                                        ))}

                                        {fields.length < 1 && (
                                            <Form.Item>
                                                <Button
                                                    type="text"
                                                    onClick={() => add()}
                                                    block
                                                    icon={<EditOutlined />}
                                                >
                                                    Изменить email и/или пароль
                                                </Button>
                                            </Form.Item>
                                        )}
                                    </div>
                                )}
                            </Form.List>

                            <Divider />
                            <Flex gap={10} justify="space-between">
                                <Button
                                    style={{
                                        opacity: 0.75,
                                        fontSize: 12,
                                    }}
                                    icon={<LongLeftArrow />}
                                    onClick={() => router.back()}
                                    type="link"
                                >
                                    Назад
                                </Button>

                                <Button
                                    htmlType="submit"
                                    type="link"
                                    style={{
                                        opacity: 0.75,
                                        fontSize: 12,
                                    }}
                                    iconPosition="end"
                                    icon={<CheckOutlined />}
                                >
                                    Подтвердить изменения
                                </Button>
                            </Flex>
                        </Form>
                    </ConfigProvider>
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
                        <QuestionCircleOutlined style={{ color: "orange" }} />
                        <Title level={5}>Удалить все ваши данные?</Title>
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
                        Будьте внимательны, это необратимое действие! <br />
                        Убедитесь, что Вы экспортировали свои данные заранее.
                        <br />
                        Для того, чтобы удалить данные, введите в поле ниже - (
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
                    href: "/login",
                }}
                title={
                    <Flex gap={10}>
                        <QuestionCircleOutlined style={{ color: "orange" }} />
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
                        Будьте внимательны, это необратимое действие! <br />
                        Для того, чтобы удалить аккаунт, введите в поле ниже - (
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
        </div>
    ) : (
        <p>У вас нет доступа к данной странице</p>
    );
}
