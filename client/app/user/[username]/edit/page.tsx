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
    getUserByUserName,
    MainUserInfo,
    registerUser,
    UserInfo,
    UserRequest,
} from "../../../services/user";
import Link from "next/link";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import AvatarPicker from "../../../components/AvatarPicker";
import Title from "antd/es/typography/Title";
import { LongLeftArrow } from "@/app/img/LongLeftArrow";
dayjs.locale("ru");
export default function EditUserPage({
    params,
}: {
    params: { username: string };
}) {
    const [form] = Form.useForm();
    const getUser = async () => {
        const user = await getUserByUserName(params.username);
        setUser(user.userInfo);
    };
    useEffect(() => {
        getUser();
    }, []);
    const [user, setUser] = useState<UserInfo>();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

    const onFinish = (values) => {
        console.log("Success:", values);
        // Здесь вы должны обработать данные и обновить профиль пользователя
        setUser(values);
        message.success("Профиль успешно обновлен!");
    };

    useEffect(() => {
        form.setFieldsValue(user); // Устанавливаем начальные значения формы
        form.setFieldValue("dateBirth", dayjs(user?.dateBirth));
    }, [user, form]);
    const handleConfirm = () => {
        return (
            <Modal
                open={open}
                title="Title"
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <Button style={{ marginRight: "auto" }}>
                            Custom Button
                        </Button>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        );
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
                    <Form form={form}>
                        <Form.Item valuePropName="src" name={"avatar"}>
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
                            <Input spellCheck={false} />
                        </Form.Item>
                        <Form.Item name={"email"} label={"Эл. почта"}>
                            <Input
                                disabled
                                variant="borderless"
                                spellCheck={false}
                            />
                        </Form.Item>
                        <Button>Изменить email и/или пароль</Button>
                        <Divider orientation="left">
                            Необязательные параметры
                        </Divider>
                        <Form.Item name={"name"} label={"Имя"}>
                            <Input spellCheck={false} />
                        </Form.Item>
                        <Form.Item name={"surName"} label={"Фамилия"}>
                            <Input spellCheck={false} />
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

                        <Popconfirm
                            okText={"Удалить"}
                            okButtonProps={{ danger: true }}
                            cancelText={"Нет"}
                            title="Удалить аккаунт?"
                            description={"Будьте осторожны, это необратимо!"}
                        >
                            <Button ghost type="primary" danger>
                                Удалить аккаунт
                            </Button>
                        </Popconfirm>
                    </Flex>
                </Col>
            </Row>
            <Modal
                centered
                onCancel={() => setOpenDelete(false)}
                closeIcon={false}
                open={openDelete}
                cancelText="Нет"
                okText="Удалить"
                okButtonProps={{ danger: true }}
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
                            >
                                Экспортировать
                            </Button>
                            <CancelBtn />
                            <OkBtn />
                        </Flex>
                    </>
                )}
            >
                <Typography.Text>
                    Будьте внимательны, это необратимое действие! <br />
                    Убедитесь, что Вы экспортировали свои данные заранее.
                </Typography.Text>
            </Modal>
        </div>
    );
}
