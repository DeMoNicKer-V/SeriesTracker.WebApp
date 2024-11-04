"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    UserOutlined,
    RightOutlined,
    LoginOutlined,
    ProfileOutlined,
    CheckSquareOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    WarningOutlined,
    DownloadOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    EditOutlined,
    CloseOutlined,
    KeyOutlined,
} from "@ant-design/icons";
import Typewriter from "typewriter-effect";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    GetProp,
    Input,
    Row,
    Space,
    Image,
    Steps,
    Typography,
    Upload,
    UploadFile,
    UploadProps,
    message,
    Divider,
    Result,
    ConfigProvider,
    InputRef,
    Breadcrumb,
    DescriptionsProps,
    Descriptions,
    Tooltip,
    Popconfirm,
    Modal,
} from "antd";
import ImgCrop from "antd-img-crop";
import Meta from "antd/es/card/Meta";
import {
    checkExistEmail,
    checkExistUserName,
    deleteSeriesByUsername,
    deleteUserByUsername,
    getUserByUserName,
    MainUserInfo,
    registerUser,
    UserInfo,
    UserRequest,
    verify,
} from "../../../services/user";
import Link from "next/link";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import AvatarPicker from "../../../components/AvatarPicker";
import Title from "antd/es/typography/Title";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { LogOut } from "@/app/api/coockie";
dayjs.locale("ru");
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo>();
    const [deleteStr, setDeleteStr] = useState<string>("");
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
    const [form] = Form.useForm();
    const getUser = async () => {
        const user = await getUserByUserName(params.username);
        setUser(user.userInfo);
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

    const onFinish = (values: any) => {
        const UserRequest = {
            userName: values["userName"],
            name: values["name"],
            surName: values["surName"],
            email: values["emailPassword"][0].email,
            password: values["emailPassword"][0]["passwordList"][0].newPassword,
            avatar: values["avatar"],
            dateBirth: values["dateBirth"]
                ? values["dateBirth"].format("DD-MM-YYYY").toString()
                : "",
        };
        console.log(UserRequest);
        message.success("Профиль успешно обновлен!");
    };

    useEffect(() => {
        form.setFieldsValue(user); // Устанавливаем начальные значения формы
        form.setFieldValue(
            "dateBirth",
            !user?.dateBirth ? null : dayjs(user?.dateBirth)
        );
    }, [user, form]);

    const onClose = () => {
        setOpenDelete(false);
        setOpenDeleteUser(false);
        setDeleteStr("");
    };
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    return (
        <div className="container">
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
                        separator: ":",
                    },
                    {
                        title: (
                            <Link
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    fontStyle: "italic",
                                    gap: 5,
                                    fontSize: 11,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                href={"./"}
                            >
                                <LongLeftArrow />
                                Назад
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
                    <Form
                        spellCheck={false}
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                            valuePropName="src"
                            name={"avatar"}
                        >
                            <Avatar size={160} shape="square" />
                        </Form.Item>
                        <Space
                            style={{ justifyContent: "center" }}
                            wrap
                            size={[10, 10]}
                        >
                            <AvatarPicker targetValue={setFileList} />
                            <Meta
                                title={
                                    <Typography.Title level={5}>
                                        {"Выберите ваш новый аватар"}
                                    </Typography.Title>
                                }
                                description={
                                    <Typography.Text
                                        italic
                                        style={{ fontSize: 12 }}
                                    >
                                        {
                                            "допускаются только файлы формата JPG/PNG, размером не превышающие 512 КБ"
                                        }
                                    </Typography.Text>
                                }
                            ></Meta>
                        </Space>
                        <Form.Item
                            name={"userName"}
                            tooltip={"Чувствителен к регистру"}
                            label={"Имя пользователя"}
                        >
                            <Input />
                        </Form.Item>

                        <Divider>{user?.email}</Divider>

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
                                                backgroundColor: "transparent",
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
                                                        required: true,
                                                        message:
                                                            "Эл. почта не может быть пустой.",
                                                    },
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

                        <Divider orientation="left">
                            Необязательные параметры
                        </Divider>
                        <Form.Item name={"name"} label={"Имя"}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={"surName"} label={"Фамилия"}>
                            <Input />
                        </Form.Item>
                        <Form.Item name={"dateBirth"} label={"Дата рождения"}>
                            <DatePicker
                                locale={locale}
                                format={"D MMMM, YYYY г."}
                                maxDate={dayjs(
                                    new Date().setFullYear(
                                        new Date().getFullYear() - 12
                                    )
                                )}
                                style={{ width: "100%" }}
                                placeholder="Укажите вашу дату рождения"
                            />
                        </Form.Item>
                        <Divider />
                        <Flex gap={10} justify="end">
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Назад
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Сохранить изменения
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                    <Button ghost type="primary">
                        Экспортировать данные
                    </Button>
                    <Button ghost type="primary">
                        Импортировать данные
                    </Button>
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
                        <Typography.Title level={5}>
                            Удалить все ваши данные?
                        </Typography.Title>
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
                        <Typography.Text type="danger" code strong>
                            УДАЛИТЬ
                        </Typography.Text>
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
                        <Typography.Title level={5}>
                            Удалить Ваш Аккаунт?
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
                    <Paragraph>
                        Будьте внимательны, это необратимое действие! <br />
                        Для того, чтобы удалить аккаунт, введите в поле ниже - (
                        <Typography.Text type="danger" code strong>
                            УДАЛИТЬ
                        </Typography.Text>
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
    );
}
